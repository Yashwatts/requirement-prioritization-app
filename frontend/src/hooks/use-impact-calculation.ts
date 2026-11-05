"use client";

import { useEffect } from "react";
import {
  useWatch,
  type Control,
  type UseFormSetValue,
  type UseFormGetValues,
} from "react-hook-form";
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

export const getLevelNameFromImpactId = (
  selectedImpactUserId: string | number,
  allDomainImpactUsers: DomainImpactUsers[] | undefined,
): string | undefined => {
  if (
    selectedImpactUserId === "" ||
    selectedImpactUserId === undefined ||
    selectedImpactUserId === null ||
    !allDomainImpactUsers
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
    }
  }

  return undefined;
};

export const useImpactCalculation = ({
  control,
  setValue,
  getValues,
  apiInstitutions: _apiInstitutions,
  apiDomains,
  apiImpactUsers,
}: UseImpactCalculationParameters): UseImpactCalculationReturn => {
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
      !apiDomains ||
      !apiImpactUsers
    ) {
      return;
    }

    if (!watchedDomain) {
      if (watchedImpactUsers) {
        setValue("impactUsers", "", { shouldValidate: false });
      }
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

    const domainImpactGroup = apiImpactUsers?.find(
      (impactGroup) => impactGroup.domain_uuid === resolvedDomain.uuid,
    );
    if (!domainImpactGroup || !Array.isArray(domainImpactGroup.impact_users)) {
      return;
    }

    const numericImpactUserId = Number(watchedImpactUsers);
    const matchedImpactUser = domainImpactGroup.impact_users.find(
      (item) => Number(item.id) === numericImpactUserId,
    );

    if (
      !matchedImpactUser ||
      matchedImpactUser.from === undefined ||
      matchedImpactUser.to === undefined
    ) {
      return;
    }

    const userImpactValue = Math.round(
      (matchedImpactUser.from + matchedImpactUser.to) / 2,
    );

    const totalBenefited = Array.isArray(watchedBenefitedInstitutions)
      ? watchedBenefitedInstitutions.length
      : 0;

    const obligationValue = watchedIsObligatory === "Yes" ? 8 : 0;
    const alternativeSolutionValue =
      watchedHasAlternativeSolution === "Yes" ? 0 : 8;

    const calculatedImpact =
      totalBenefited +
      obligationValue +
      alternativeSolutionValue +
      userImpactValue;

    let calculatedPriority = "High";
    if (calculatedImpact <= 10) {
      calculatedPriority = "Low";
    } else if (calculatedImpact <= 20) {
      calculatedPriority = "Medium";
    }

    setValue("impact", String(calculatedImpact), { shouldValidate: false });
    setValue("clientPriorityOverride", calculatedPriority, {
      shouldValidate: false,
    });
  }, [
    watchedDomain,
    watchedBenefitedInstitutions,
    watchedIsObligatory,
    watchedHasAlternativeSolution,
    watchedImpactUsers,
    apiDomains,
    apiImpactUsers,
    setValue,
    getValues,
  ]);

  return {
    watchedDomain,
  };
};
