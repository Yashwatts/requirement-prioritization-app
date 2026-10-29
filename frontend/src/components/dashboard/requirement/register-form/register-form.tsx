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
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { DiscardDialog } from "./discard-dialog/discard-dialog";
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
      clearErrors();
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
    () => apiInstitutions?.map((inst) => inst.name) ?? [],
    [apiInstitutions],
  );

  const benefitedInstitutionOptions = useMemo(
    () => institutionOptions.filter((name) => name !== "Grupo Funiber"),
    [institutionOptions],
  );

  const domainOptions = useMemo(
    () => apiDomains?.map((d) => d.name) ?? [],
    [apiDomains],
  );

  const watchedDomain = useWatch({ control, name: "domain" });
  const watchedBenefited = useWatch({ control, name: "benefitedInstitutions" });
  const watchedObligatory = useWatch({ control, name: "isObligatory" });
  const watchedAlternative = useWatch({
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

    const resolvedDomain = apiDomains.find((d) => d.name === watchedDomain);
    if (!resolvedDomain) return defaultOptions;

    const domainImpact = apiImpactUsers.find(
      (di) => di.domain_uuid === resolvedDomain.uuid,
    );
    if (!domainImpact || !domainImpact.impact_users) return defaultOptions;

    const { LOW, MEDIUM, HIGH, VERY_HIGH } = domainImpact.impact_users;

    return [
      {
        label: LOW ? `Low (${LOW.from}-${LOW.to})` : "Low",
        value: LOW?.id ?? 1,
      },
      {
        label: MEDIUM ? `Medium (${MEDIUM.from}-${MEDIUM.to})` : "Medium",
        value: MEDIUM?.id ?? 2,
      },
      {
        label: HIGH ? `High (${HIGH.from}-${HIGH.to})` : "High",
        value: HIGH?.id ?? 3,
      },
      {
        label: VERY_HIGH
          ? `Very High (${VERY_HIGH.from}-${VERY_HIGH.to})`
          : "Very High",
        value: VERY_HIGH?.id ?? 4,
      },
    ];
  }, [watchedDomain, apiDomains, apiImpactUsers]);

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

    const resolvedDomain = apiDomains?.find((d) => d.name === watchedDomain);
    if (!resolvedDomain) return;

    const timer = setTimeout(async () => {
      try {
        const result = await dispatch(
          calculateImpact({
            benefited_institutions: Array.isArray(watchedBenefited)
              ? watchedBenefited
              : [],
            obligation: watchedObligatory === "Yes",
            exist_solution_alternative: watchedAlternative === "Yes",
            domain_in_charge_id: resolvedDomain.id,
            impact_number_users_id: watchedImpactUsers,
          }),
        ).unwrap();

        setValue("impact", String(result.impact), { shouldValidate: true });
        setValue("clientPriorityOverride", result.client_priority_name, {
          shouldValidate: true,
        });
      } catch {}
    }, 300);

    return () => clearTimeout(timer);
  }, [
    watchedDomain,
    watchedBenefited,
    watchedObligatory,
    watchedAlternative,
    watchedImpactUsers,
    apiDomains,
    dispatch,
    setValue,
    getValues,
  ]);

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
    showSnackbar("Requisition registration cancelled", "info");
  };

  const onSubmit = async (values: RequirementFormValues) => {
    const resolvedInstitution = apiInstitutions?.find(
      (inst) => inst.name === values.requestingInstitution,
    );
    const resolvedDomain = apiDomains?.find(
      (domain) => domain.name === values.domain,
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
      start_date: values.startDate || undefined,
      end_date: values.finishDate || undefined,
      type: values.type,
    };

    const actionResult = await dispatch(createRequirement(payload));

    if (createRequirement.fulfilled.match(actionResult)) {
      showSnackbar("Requisition registered successfully", "success");
      dispatch(setPage(1));
      dispatch(fetchRequirements({ page: 1, limit: 10, sortOrder: "DESC" }));
      onCreated();
      forceClose();
    } else {
      const errorMessage =
        typeof actionResult.payload === "string"
          ? actionResult.payload
          : "Unable to create requirement. Please check your inputs.";
      showSnackbar(errorMessage, "error");
    }
  };

  const onInvalid = () => {
    showSnackbar("Please fill all required fields correctly.", "warning");
  };

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
              onToggleMinimize={() => setMinimized((prev) => !prev)}
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

      <DiscardDialog
        open={discardDialogOpen}
        onCancel={() => setDiscardDialogOpen(false)}
        onConfirm={handleConfirmDiscard}
      />
    </>
  );
};
