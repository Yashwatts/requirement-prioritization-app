"use client";

import { useEffect } from "react";
import {
  useWatch,
  type Control,
  type UseFormSetValue,
  type UseFormGetValues,
} from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { calculateImpact } from "@/features/requirement/requirement.action";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import type { Institution } from "@/types/institution.types";
import type { Domain } from "@/types/domain.types";
import type { DomainImpactUsers } from "@/features/requirement/requirement.type";

export interface UseImpactCalculationParameters {
  control: Control<RequirementFormValues>;
  setValue: UseFormSetValue<RequirementFormValues>;
  getValues: UseFormGetValues<RequirementFormValues>;
  apiInstitutions?: Institution[];
  apiDomains?: Domain[];
  apiImpactUsers?: DomainImpactUsers[];
}

export interface UseImpactCalculationReturn {
  watchedDomain?: string;
}

const getLevelNameFromImpactId = (
  selectedImpactUserId: string | number,
  allDomainImpactUsers: DomainImpactUsers[] | undefined,
): string | undefined => {
  if (
    !allDomainImpactUsers ||
    selectedImpactUserId === "" ||
    selectedImpactUserId === undefined ||
    selectedImpactUserId === null
  ) {
    return undefined;
  }
  const numericImpactUserId = Number(selectedImpactUserId);

  for (const domainImpactGroup of allDomainImpactUsers) {
    if (Array.isArray(domainImpactGroup.impact_users)) {
      const matchedImpactUser = domainImpactGroup.impact_users.find(
        (impactUserItem) => Number(impactUserItem.id) === numericImpactUserId,
      );
      if (matchedImpactUser) {
        return matchedImpactUser.name.toUpperCase();
      }
    } else if (domainImpactGroup.impact_users) {
      const impactUsersByLevel =
        domainImpactGroup.impact_users as unknown as Record<
          string,
          { id?: number }
        >;
      for (const [impactLevelKey, impactUserDetails] of Object.entries(
        impactUsersByLevel,
      )) {
        if (
          impactUserDetails &&
          Number(impactUserDetails.id) === numericImpactUserId
        ) {
          return impactLevelKey.toUpperCase();
        }
      }
    }
  }

  if (numericImpactUserId === 1) return "LOW";
  if (numericImpactUserId === 2) return "MEDIUM";
  if (numericImpactUserId === 3) return "HIGH";
  if (numericImpactUserId === 4) return "VERY_HIGH";

  return undefined;
};

export const useImpactCalculation = ({
  control,
  setValue,
  getValues,
  apiInstitutions,
  apiDomains,
  apiImpactUsers,
}: UseImpactCalculationParameters): UseImpactCalculationReturn => {
  const dispatch = useAppDispatch();

  const watchedDomain = useWatch({ control, name: "domain" });
  const watchedBenefitedInstitutions = useWatch({
    control,
    name: "benefitedInstitutions",
  });
  const watchedIsObligatory = useWatch({ control, name: "isObligatory" });
  const watchedHasAlternativeSolution = useWatch({
    control,
    name: "hasAlternativeSolution",
  });
  const watchedImpactUsers = useWatch({ control, name: "impactUsers" });

  useEffect(() => {
    if (
      !watchedImpactUsers ||
      !watchedDomain ||
      !apiDomains ||
      !apiImpactUsers
    ) {
      return;
    }

    const resolvedDomain = apiDomains.find(
      (domainItem) => domainItem.name === watchedDomain,
    );
    if (!resolvedDomain) return;

    const domainImpactGroup = apiImpactUsers.find(
      (impactGroup) => impactGroup.domain_uuid === resolvedDomain.uuid,
    );
    if (!domainImpactGroup || !domainImpactGroup.impact_users) return;

    if (Array.isArray(domainImpactGroup.impact_users)) {
      const belongsToCurrentDomain = domainImpactGroup.impact_users.some(
        (impactUserItem) =>
          Number(impactUserItem.id) === Number(watchedImpactUsers),
      );

      if (!belongsToCurrentDomain) {
        const currentLevelName = getLevelNameFromImpactId(
          watchedImpactUsers,
          apiImpactUsers,
        );
        if (currentLevelName) {
          const matchedImpactUser = domainImpactGroup.impact_users.find(
            (impactUserItem) =>
              impactUserItem.name.toUpperCase() === currentLevelName,
          );
          if (matchedImpactUser) {
            setValue("impactUsers", matchedImpactUser.id, {
              shouldValidate: false,
            });
            return;
          }
        }
        setValue("impactUsers", "", { shouldValidate: false });
      }
    } else if (domainImpactGroup.impact_users) {
      const impactUsersByLevel =
        domainImpactGroup.impact_users as unknown as Record<
          string,
          { id?: number }
        >;
      const belongsToCurrentDomain = Object.values(impactUsersByLevel).some(
        (impactUserDetails) =>
          impactUserDetails &&
          Number(impactUserDetails.id) === Number(watchedImpactUsers),
      );
      if (!belongsToCurrentDomain) {
        const currentLevelName = getLevelNameFromImpactId(
          watchedImpactUsers,
          apiImpactUsers,
        );
        if (currentLevelName && impactUsersByLevel[currentLevelName]?.id) {
          setValue("impactUsers", impactUsersByLevel[currentLevelName]!.id!, {
            shouldValidate: false,
          });
          return;
        }
        setValue("impactUsers", "", { shouldValidate: false });
      }
    }
  }, [watchedDomain, watchedImpactUsers, apiDomains, apiImpactUsers, setValue]);

  useEffect(() => {
    if (!watchedImpactUsers || !watchedDomain) {
      if (getValues("impact")) {
        setValue("impact", "", { shouldValidate: false });
      }
      if (getValues("clientPriorityOverride")) {
        setValue("clientPriorityOverride", "", { shouldValidate: false });
      }
      return;
    }

    const resolvedDomain = apiDomains?.find(
      (domainItem) => domainItem.name === watchedDomain,
    );
    if (!resolvedDomain) return;

    const debounceTimer = setTimeout(async () => {
      try {
        const benefitedInstitutionIds = Array.isArray(
          watchedBenefitedInstitutions,
        )
          ? watchedBenefitedInstitutions
              .map((institutionName) => {
                const matchedInstitution = apiInstitutions?.find(
                  (institution) => institution.name === institutionName,
                );
                return matchedInstitution
                  ? matchedInstitution.id
                  : typeof institutionName === "number"
                    ? institutionName
                    : Number(institutionName);
              })
              .filter(
                (institutionId): institutionId is number =>
                  typeof institutionId === "number" && !isNaN(institutionId),
              )
          : [];

        const calculationResult = await dispatch(
          calculateImpact({
            benefited_institutions: benefitedInstitutionIds,
            obligation: watchedIsObligatory === "Yes",
            exist_solution_alternative: watchedHasAlternativeSolution === "Yes",
            domain_in_charge_id: resolvedDomain.id,
            impact_number_users_id: watchedImpactUsers,
          }),
        ).unwrap();

        setValue("impact", String(calculationResult.impact), {
          shouldValidate: false,
        });
        setValue(
          "clientPriorityOverride",
          calculationResult.client_priority_name,
          {
            shouldValidate: false,
          },
        );
      } catch {
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [
    watchedDomain,
    watchedBenefitedInstitutions,
    watchedIsObligatory,
    watchedHasAlternativeSolution,
    watchedImpactUsers,
    apiDomains,
    apiInstitutions,
    dispatch,
    setValue,
    getValues,
  ]);

  return {
    watchedDomain,
  };
};
