"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDomains,
  fetchImpactUsers,
  fetchInstitutions,
} from "@/features/requirement/requirement.action";
import type { Institution } from "@/types/institution.types";
import type { Domain } from "@/types/domain.types";
import type {
  DomainImpactUsers,
  UserImpactRanges,
} from "@/features/requirement/requirement.type";
import { getLevelNameFromImpactId } from "./use-impact-calculation";

export interface UseRequirementOptionsParameters {
  open: boolean;
  watchedDomain?: string;
  watchedImpactUsers?: string | number;
}

export interface UseRequirementOptionsReturn {
  apiInstitutions: Institution[];
  apiDomains: Domain[];
  apiImpactUsers: DomainImpactUsers[];
  isInstitutionsLoading: boolean;
  isDomainsLoading: boolean;
  isImpactUsersLoading: boolean;
  institutionOptions: string[];
  benefitedInstitutionOptions: string[];
  domainOptions: string[];
  impactOptions: { label: string; value: number }[];
  handleInstitutionsOpen: () => void;
  handleDomainsOpen: () => void;
  handleImpactUsersOpen: () => void;
}

const DEFAULT_IMPACT_OPTIONS = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 2 },
  { label: "High", value: 3 },
  { label: "Very High", value: 4 },
];

const IMPACT_PRIORITY_ORDER_MAP: Record<string, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
};

const formatImpactLabel = (
  levelName: string,
  rangeFrom?: number,
  rangeTo?: number,
): string => {
  const formattedTitle =
    levelName.toUpperCase() === "VERY_HIGH"
      ? "Very High"
      : levelName.charAt(0).toUpperCase() + levelName.slice(1).toLowerCase();
  return rangeFrom !== undefined && rangeTo !== undefined
    ? `${formattedTitle} (${rangeFrom}-${rangeTo})`
    : formattedTitle;
};

export const useRequirementOptions = ({
  open,
  watchedDomain,
  watchedImpactUsers,
}: UseRequirementOptionsParameters): UseRequirementOptionsReturn => {
  const dispatch = useAppDispatch();

  const {
    institutions: apiInstitutions,
    institutionsStatus,
    domains: apiDomains,
    domainsStatus,
    impactUsers: apiImpactUsers,
    impactUsersStatus,
  } = useAppSelector((state) => state.requirements);

  useEffect(() => {
    if (open) {
      if (institutionsStatus === "idle") {
        dispatch(fetchInstitutions());
      }
      if (domainsStatus === "idle") {
        dispatch(fetchDomains());
      }
      if (impactUsersStatus === "idle") {
        dispatch(fetchImpactUsers());
      }
    }
  }, [open, institutionsStatus, domainsStatus, impactUsersStatus, dispatch]);

  const handleInstitutionsOpen = () => {
    if (institutionsStatus === "idle") {
      dispatch(fetchInstitutions());
    }
  };

  const handleDomainsOpen = () => {
    if (domainsStatus === "idle") {
      dispatch(fetchDomains());
    }
  };

  const handleImpactUsersOpen = () => {
    if (impactUsersStatus === "idle") {
      dispatch(fetchImpactUsers());
    }
  };

  const institutionOptions = useMemo(
    () => apiInstitutions?.map((institution) => institution.name) ?? [],
    [apiInstitutions],
  );

  const benefitedInstitutionOptions = useMemo(
    () =>
      institutionOptions.filter(
        (institutionName) => institutionName !== "Grupo Funiber",
      ),
    [institutionOptions],
  );

  const domainOptions = useMemo(
    () => apiDomains?.map((domainItem) => domainItem.name) ?? [],
    [apiDomains],
  );

  const impactOptions = useMemo((): { label: string; value: number }[] => {
    const getDefaultOptionsForCurrentSelection = () => {
      if (watchedImpactUsers && apiImpactUsers) {
        const levelName = getLevelNameFromImpactId(
          watchedImpactUsers,
          apiImpactUsers,
        );
        if (levelName) {
          return DEFAULT_IMPACT_OPTIONS.map((defaultOption) => {
            const optionLevel = defaultOption.label
              .toUpperCase()
              .replace(" ", "_");
            if (optionLevel === levelName) {
              return {
                ...defaultOption,
                value: Number(watchedImpactUsers),
              };
            }
            return defaultOption;
          });
        }
      }
      return DEFAULT_IMPACT_OPTIONS;
    };

    if (!watchedDomain || !apiDomains || !apiImpactUsers) {
      return getDefaultOptionsForCurrentSelection();
    }

    const resolvedDomain = apiDomains.find(
      (domainItem) => domainItem.name === watchedDomain,
    );
    if (!resolvedDomain) {
      return getDefaultOptionsForCurrentSelection();
    }

    const domainImpactGroup = apiImpactUsers.find(
      (impactGroup) => impactGroup.domain_uuid === resolvedDomain.uuid,
    );
    if (!domainImpactGroup || !domainImpactGroup.impact_users) {
      return DEFAULT_IMPACT_OPTIONS;
    }

    if (Array.isArray(domainImpactGroup.impact_users)) {
      const sortedImpactUsers = [...domainImpactGroup.impact_users].sort(
        (firstImpactUser, secondImpactUser) =>
          (IMPACT_PRIORITY_ORDER_MAP[firstImpactUser.name.toUpperCase()] ?? 99) -
          (IMPACT_PRIORITY_ORDER_MAP[secondImpactUser.name.toUpperCase()] ?? 99),
      );

      return sortedImpactUsers.map((impactUserItem) => ({
        label: formatImpactLabel(
          impactUserItem.name,
          impactUserItem.from,
          impactUserItem.to,
        ),
        value: impactUserItem.id,
      }));
    }

    const { LOW, MEDIUM, HIGH, VERY_HIGH } =
      domainImpactGroup.impact_users as unknown as UserImpactRanges;

    return [
      {
        label: formatImpactLabel("LOW", LOW?.from, LOW?.to),
        value: LOW?.id ?? 1,
      },
      {
        label: formatImpactLabel("MEDIUM", MEDIUM?.from, MEDIUM?.to),
        value: MEDIUM?.id ?? 2,
      },
      {
        label: formatImpactLabel("HIGH", HIGH?.from, HIGH?.to),
        value: HIGH?.id ?? 3,
      },
      {
        label: formatImpactLabel("VERY_HIGH", VERY_HIGH?.from, VERY_HIGH?.to),
        value: VERY_HIGH?.id ?? 4,
      },
    ];
  }, [watchedDomain, watchedImpactUsers, apiDomains, apiImpactUsers]);

  return {
    apiInstitutions,
    apiDomains,
    apiImpactUsers,
    isInstitutionsLoading: institutionsStatus === "loading",
    isDomainsLoading: domainsStatus === "loading",
    isImpactUsersLoading: impactUsersStatus === "loading",
    institutionOptions,
    benefitedInstitutionOptions,
    domainOptions,
    impactOptions,
    handleInstitutionsOpen,
    handleDomainsOpen,
    handleImpactUsersOpen,
  };
};

