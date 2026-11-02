"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FormProvider,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Drawer } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSnackbar } from "@/shared/snackbar/use-snackbar";
import {
  calculateImpact,
  createRequirement,
  fetchDomains,
  fetchImpactUsers,
  fetchInstitutions,
  fetchRequirements,
} from "@/features/requirement/requirement.action";
import { setPage } from "@/features/requirement/requirement.slice";
import {
  requirementFormSchema,
  type RequirementFormValues,
} from "@/schemas/requirement.schema";
import type { CreateRequirementPayload } from "@/types/requirement.types";
import type {
  DomainImpactUsers,
  UserImpactRanges,
} from "@/features/requirement/requirement.type";
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { ConfirmDialog } from "@/shared/confirm-dialog/confirm-dialog";
import { useLocalization } from "@/localize";
import { GeneralInfo } from "./general-info/general-info";
import { BeneficiariesScope } from "./beneficiaries-scope/beneficiaries-scope";
import { ImpactFeasibility } from "./impact-feasibility/impact-feasibility";
import { Timeline } from "./timeline/timeline";
import { Description } from "./description/description";
import styles from "./register-form.module.css";

const DEFAULT_FORM_VALUES: RequirementFormValues = {
  name: "",
  requestedBy: [],
  requestingInstitution: "",
  type: "",
  domain: "",
  collaboratorDomains: [],
  followerDomains: [],
  benefitedInstitutions: [],
  studyModalities: [],
  isObligatory: "" as unknown as "Yes" | "No",
  hasAlternativeSolution: "" as unknown as "Yes" | "No",
  impactUsers: "",
  impact: "",
  complexityEffort: "",
  clientPriorityOverride: "",
  status: "Registered",
  startDate: "",
  finishDate: "",
  description: "",
};

export interface RegisterFormProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const RegisterForm = ({
  open,
  onClose,
  onCreated,
}: RegisterFormProps) => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { translate } = useLocalization();

  const {
    institutions: apiInstitutions,
    institutionsStatus,
    domains: apiDomains,
    domainsStatus,
    impactUsers: apiImpactUsers,
    impactUsersStatus,
  } = useAppSelector((state) => state.requirements);

  const [minimized, setMinimized] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  const methods = useForm<RequirementFormValues>({
    resolver: zodResolver(
      requirementFormSchema,
    ) as unknown as Resolver<RequirementFormValues>,
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;

  useEffect(() => {
    if (open) {
      reset(DEFAULT_FORM_VALUES);
      clearErrors();
    }
  }, [open, reset, clearErrors]);

  useEffect(() => {
    if (open) {
      if (institutionsStatus === "idle") dispatch(fetchInstitutions());
      if (domainsStatus === "idle") dispatch(fetchDomains());
      if (impactUsersStatus === "idle") dispatch(fetchImpactUsers());
    }
  }, [open, institutionsStatus, domainsStatus, impactUsersStatus, dispatch]);

  const handleInstitutionsOpen = () => {
    if (institutionsStatus === "idle") dispatch(fetchInstitutions());
  };

  const handleDomainsOpen = () => {
    if (domainsStatus === "idle") dispatch(fetchDomains());
  };

  const handleImpactUsersOpen = () => {
    if (impactUsersStatus === "idle") dispatch(fetchImpactUsers());
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

  const impactOptions = useMemo((): { label: string; value: number }[] => {
    const defaultOptions = [
      { label: "Low", value: 1 },
      { label: "Medium", value: 2 },
      { label: "High", value: 3 },
      { label: "Very High", value: 4 },
    ];
    if (!watchedDomain || !apiDomains || !apiImpactUsers) return defaultOptions;

    const resolvedDomain = apiDomains.find(
      (domainItem) => domainItem.name === watchedDomain,
    );
    if (!resolvedDomain) return defaultOptions;

    const domainImpactGroup = apiImpactUsers.find(
      (item) => item.domain_uuid === resolvedDomain.uuid,
    );
    if (!domainImpactGroup || !domainImpactGroup.impact_users) {
      return defaultOptions;
    }

    const formatLabel = (
      levelName: string,
      rangeFrom?: number,
      rangeTo?: number,
    ) => {
      const formattedTitle =
        levelName.toUpperCase() === "VERY_HIGH"
          ? "Very High"
          : levelName.charAt(0).toUpperCase() +
            levelName.slice(1).toLowerCase();
      return rangeFrom !== undefined && rangeTo !== undefined
        ? `${formattedTitle} (${rangeFrom}-${rangeTo})`
        : formattedTitle;
    };

    if (Array.isArray(domainImpactGroup.impact_users)) {
      const priorityOrderMap: Record<string, number> = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3,
        VERY_HIGH: 4,
      };

      const sortedImpactUsers = [...domainImpactGroup.impact_users].sort(
        (firstImpactUser, secondImpactUser) =>
          (priorityOrderMap[firstImpactUser.name.toUpperCase()] ?? 99) -
          (priorityOrderMap[secondImpactUser.name.toUpperCase()] ?? 99),
      );

      return sortedImpactUsers.map((impactUserItem) => ({
        label: formatLabel(
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
        label: formatLabel("LOW", LOW?.from, LOW?.to),
        value: LOW?.id ?? 1,
      },
      {
        label: formatLabel("MEDIUM", MEDIUM?.from, MEDIUM?.to),
        value: MEDIUM?.id ?? 2,
      },
      {
        label: formatLabel("HIGH", HIGH?.from, HIGH?.to),
        value: HIGH?.id ?? 3,
      },
      {
        label: formatLabel("VERY_HIGH", VERY_HIGH?.from, VERY_HIGH?.to),
        value: VERY_HIGH?.id ?? 4,
      },
    ];
  }, [watchedDomain, apiDomains, apiImpactUsers]);

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
      (item) => item.domain_uuid === resolvedDomain.uuid,
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
      } catch {}
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

  useEffect(() => {
    const handleBeforeUnload = (beforeUnloadEvent: BeforeUnloadEvent) => {
      if (!open) return;

      const currentFormValues = getValues();
      const hasMeaningfulContent =
        isDirty ||
        Boolean(currentFormValues.name?.trim()) ||
        Boolean(currentFormValues.description?.trim()) ||
        (Array.isArray(currentFormValues.requestedBy) &&
          currentFormValues.requestedBy.length > 0) ||
        Boolean(currentFormValues.requestingInstitution) ||
        Boolean(currentFormValues.domain) ||
        (Array.isArray(currentFormValues.benefitedInstitutions) &&
          currentFormValues.benefitedInstitutions.length > 0);

      if (hasMeaningfulContent && !isSubmitting) {
        beforeUnloadEvent.preventDefault();
        beforeUnloadEvent.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [open, isDirty, isSubmitting, getValues]);

  const forceClose = () => {
    reset(DEFAULT_FORM_VALUES);
    setMinimized(false);
    setDiscardDialogOpen(false);
    onClose();
  };

  const handleRequestClose = () => {
    if (isDirty) {
      setDiscardDialogOpen(true);
    } else {
      forceClose();
    }
  };

  const handleConfirmDiscard = () => {
    forceClose();
    showSnackbar(translate("requirementRegistrationCancelled"), "info");
  };

  const onSubmit = async (values: RequirementFormValues) => {
    const resolvedInstitution = apiInstitutions?.find(
      (institution) => institution.name === values.requestingInstitution,
    );
    const resolvedDomain = apiDomains?.find(
      (domainItem) => domainItem.name === values.domain,
    );

    const payload: CreateRequirementPayload = {
      name: values.name,
      description: values.description,
      requesting_institution_id: resolvedInstitution?.id ?? 1,
      requested_by: Array.isArray(values.requestedBy)
        ? values.requestedBy
        : values.requestedBy
          ? [values.requestedBy]
          : [],
      benefited_institutions: values.benefitedInstitutions,
      study_modality: values.studyModalities,
      impact_number_users_id: values.impactUsers,
      obligation: values.isObligatory === "Yes",
      exist_solution_alternative: values.hasAlternativeSolution === "Yes",
      complexity_and_effort: values.complexityEffort,
      client_priority: values.clientPriorityOverride || undefined,
      domain_in_charge_id: resolvedDomain?.id ?? 1,
      domains_collaborators: values.collaboratorDomains,
      followers_domains: values.followerDomains,
      status: values.status,
      start_date: values.startDate
        ? values.startDate.length === 8
          ? `20${values.startDate}`
          : values.startDate
        : undefined,
      end_date: values.finishDate
        ? values.finishDate.length === 8
          ? `20${values.finishDate}`
          : values.finishDate
        : undefined,
      type: values.type,
    };

    const actionResult = await dispatch(createRequirement(payload));

    if (createRequirement.fulfilled.match(actionResult)) {
      showSnackbar(translate("requirementRegisteredSuccessfully"), "success");
      dispatch(setPage(1));
      dispatch(fetchRequirements({ page: 1, limit: 10, sortOrder: "DESC" }));
      onCreated();
      forceClose();
    } else {
      const errorMessage =
        typeof actionResult.payload === "string"
          ? actionResult.payload
          : translate("unableToCreateRequirement");
      showSnackbar(errorMessage, "error");
    }
  };

  const onInvalid = () => {};

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleRequestClose}
        hideBackdrop={minimized}
        ModalProps={{
          keepMounted: true,
          disableAutoFocus: minimized,
          disableEnforceFocus: minimized,
        }}
        className={`${styles.drawer} ${minimized ? styles.minimized : ""}`}
      >
        <FormProvider {...methods}>
          <Box
            className={styles.container}
            component="form"
            onSubmit={handleSubmit(onSubmit, onInvalid)}
          >
            <Header
              minimized={minimized}
              onToggleMinimize={() =>
                setMinimized((isCurrentlyMinimized) => !isCurrentlyMinimized)
              }
              onClose={handleRequestClose}
            />

            <Box className={styles.scrollContent}>
              <Box className={styles.formContent}>
                <GeneralInfo
                  institutionOptions={institutionOptions}
                  domainOptions={domainOptions}
                  isInstitutionsLoading={institutionsStatus === "loading"}
                  isDomainsLoading={domainsStatus === "loading"}
                  onOpenInstitutions={handleInstitutionsOpen}
                  onOpenDomains={handleDomainsOpen}
                />

                <BeneficiariesScope
                  benefitedInstitutionOptions={benefitedInstitutionOptions}
                  isInstitutionsLoading={institutionsStatus === "loading"}
                  onOpenInstitutions={handleInstitutionsOpen}
                />

                <ImpactFeasibility
                  impactOptions={impactOptions}
                  isImpactUsersLoading={impactUsersStatus === "loading"}
                  onOpenImpactUsers={handleImpactUsersOpen}
                />

                <Timeline />

                <Description />
              </Box>
            </Box>

            <Footer isSubmitting={isSubmitting} />
          </Box>
        </FormProvider>
      </Drawer>

      <ConfirmDialog
        open={discardDialogOpen}
        title={translate("discardDialogTitle")}
        description={translate("discardDialogText")}
        cancelLabel={translate("cancel")}
        confirmLabel={translate("discard")}
        onCancel={() => setDiscardDialogOpen(false)}
        onConfirm={handleConfirmDiscard}
      />
    </>
  );
};
