"use client";

import { useEffect, type BaseSyntheticEvent } from "react";
import {
  useForm,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store/hooks";
import { useSnackbar } from "@/shared/snackbar/use-snackbar";
import { useLocalization } from "@/localize";
import {
  createRequirement,
  fetchRequirements,
} from "@/features/requirement/requirement.action";
import { setPage } from "@/features/requirement/requirement.slice";
import {
  requirementFormSchema,
  type RequirementFormValues,
} from "@/schemas/requirement.schema";
import type { CreateRequirementPayload } from "@/types/requirement.types";
import { useRequirementOptions } from "./use-requirement-options";
import { useImpactCalculation } from "./use-impact-calculation";
import { useRegisterFormNavigation } from "./use-register-form-navigation";

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

export interface UseRegisterRequirementFormParameters {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export interface UseRegisterRequirementFormReturn {
  methods: UseFormReturn<RequirementFormValues>;
  minimized: boolean;
  discardDialogOpen: boolean;
  isSubmitting: boolean;
  isInstitutionsLoading: boolean;
  isDomainsLoading: boolean;
  isImpactUsersLoading: boolean;
  institutionOptions: string[];
  benefitedInstitutionOptions: string[];
  domainOptions: string[];
  impactOptions: { label: string; value: number }[];
  handleToggleMinimize: () => void;
  handleRequestClose: () => void;
  handleConfirmDiscard: () => void;
  handleCloseDiscardDialog: () => void;
  handleInstitutionsOpen: () => void;
  handleDomainsOpen: () => void;
  handleImpactUsersOpen: () => void;
  handleSubmitRequirementForm: (
    syntheticEvent?: BaseSyntheticEvent,
  ) => Promise<void>;
}

export const useRegisterRequirementForm = ({
  open,
  onClose,
  onCreated,
}: UseRegisterRequirementFormParameters): UseRegisterRequirementFormReturn => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { translate } = useLocalization();

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
    watch,
    formState: { isSubmitting, isDirty },
  } = methods;

  useEffect(() => {
    if (open) {
      reset(DEFAULT_FORM_VALUES);
      clearErrors();
    }
  }, [open, reset, clearErrors]);

  const forceClose = () => {
    reset(DEFAULT_FORM_VALUES);
    navigationState.resetNavigationState();
    onClose();
  };

  const navigationState = useRegisterFormNavigation({
    open,
    isDirty,
    isSubmitting,
    getValues,
    onForceClose: forceClose,
  });

  const watchedDomain = watch("domain");

  const {
    apiInstitutions,
    apiDomains,
    apiImpactUsers,
    isInstitutionsLoading,
    isDomainsLoading,
    isImpactUsersLoading,
    institutionOptions,
    benefitedInstitutionOptions,
    domainOptions,
    impactOptions,
    handleInstitutionsOpen,
    handleDomainsOpen,
    handleImpactUsersOpen,
  } = useRequirementOptions({
    open,
    watchedDomain,
  });

  useImpactCalculation({
    control,
    setValue,
    getValues,
    apiInstitutions,
    apiDomains,
    apiImpactUsers,
  });

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

  return {
    methods,
    minimized: navigationState.minimized,
    discardDialogOpen: navigationState.discardDialogOpen,
    isSubmitting,
    isInstitutionsLoading,
    isDomainsLoading,
    isImpactUsersLoading,
    institutionOptions,
    benefitedInstitutionOptions,
    domainOptions,
    impactOptions,
    handleToggleMinimize: navigationState.handleToggleMinimize,
    handleRequestClose: navigationState.handleRequestClose,
    handleConfirmDiscard: navigationState.handleConfirmDiscard,
    handleCloseDiscardDialog: navigationState.handleCloseDiscardDialog,
    handleInstitutionsOpen,
    handleDomainsOpen,
    handleImpactUsersOpen,
    handleSubmitRequirementForm: handleSubmit(onSubmit, onInvalid),
  };
};
