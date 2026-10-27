"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DescriptionEditor } from "./description-editor";
import { DiscardDialog } from "./discard-dialog";
import { DrawerHeader } from "./drawer-header";
import { FormSelectField, type FormSelectFieldProps } from "./form-select-field";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSnackbar } from "@/components/snackbar/use-snackbar";
import {
  calculateImpact,
  createRequirement,
  fetchDomains,
  fetchImpactUsers,
  fetchInstitutions,
  fetchRequirements,
} from "@/features/requirements/requirement.action";
import {
  mapClientPriorityToNumber,
  mapComplexityToNumber,
  mapImpactLevelToNumber,
  mapStatusToNumber,
  mapTypeToNumber,
} from "@/features/requirements/mappers/requirement.mapper";
import type {
  ClientPriority,
  ComplexityEffort,
  CreateRequirementPayload,
  RequirementStatus,
  RequirementType,
  StudyModality,
} from "@/@types/requirement.types";
import {
  requirementFormSchema,
  type RequirementFormValues,
} from "@/schemas/requirement.schema";
import styles from "./create-requirement-drawer.module.css";

const requirementTypes: RequirementType[] = ["Internal", "External", "Client"];
const modalities: StudyModality[] = [
  "Virtual",
  "Presencial",
  "Virtual/Presencial",
];
const complexities: ComplexityEffort[] = ["XS", "S", "M", "L", "XL"];
const priorities: ClientPriority[] = ["Low", "Medium", "High"];
const statusOptions: RequirementStatus[] = ["Registered", "Flow"];
const yesNoOptions = ["Yes", "No"];

const defaultValues: RequirementFormValues = {
  name: "",
  requestedBy: [],
  requestingInstitution: "",
  type: "",
  domain: "",
  collaboratorDomains: [],
  followerDomains: [],
  benefitedInstitutions: [],
  studyModalities: [],
  isObligatory: "No",
  hasAlternativeSolution: "No",
  impactUsers: "",
  impact: "",
  complexityEffort: "",
  clientPriorityOverride: "",
  status: "Registered",
  startDate: "",
  finishDate: "",
  description: "",
};

interface CreateRequirementDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

type SelectFieldHelperProps = Omit<FormSelectFieldProps, "control" | "errors">;

export const CreateRequirementDrawer = ({
  open,
  onClose,
  onCreated,
}: CreateRequirementDrawerProps) => {
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

  // Pre-fetch reference data when drawer opens
  useEffect(() => {
    if (open) {
      if (institutionsStatus === "idle") dispatch(fetchInstitutions());
      if (domainsStatus === "idle") dispatch(fetchDomains());
      if (impactUsersStatus === "idle") dispatch(fetchImpactUsers());
    }
  }, [open, institutionsStatus, domainsStatus, impactUsersStatus, dispatch]);

  // Trigger institutions fetch only when an institutions dropdown is opened
  const handleInstitutionsOpen = () => {
    if (institutionsStatus === "idle") {
      dispatch(fetchInstitutions());
    }
  };

  // Trigger domains fetch only when a domains dropdown is opened
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

  // Dynamically populated from backend reference data with NO fallback hardcoded values
  const institutionOptions = useMemo(() => {
    return apiInstitutions?.map((i) => i.name) ?? [];
  }, [apiInstitutions]);

  const benefitedInstitutionOptions = useMemo(() => {
    return institutionOptions.filter(
      (institution) => institution !== "Grupo Funiber",
    );
  }, [institutionOptions]);

  const domainOptions = useMemo(() => {
    return apiDomains?.map((d) => d.name) ?? [];
  }, [apiDomains]);

  const isInstitutionsLoading = institutionsStatus === "loading";
  const isDomainsLoading = domainsStatus === "loading";
  const isImpactUsersLoading = impactUsersStatus === "loading";

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequirementFormValues>({
    resolver:
      zodResolver(requirementFormSchema) as unknown as Resolver<RequirementFormValues>,
    defaultValues,
    mode: "onSubmit",
  });

  const watchedDomain = useWatch({ control, name: "domain" });
  const watchedBenefited = useWatch({
    control,
    name: "benefitedInstitutions",
  });
  const watchedObligatory = useWatch({ control, name: "isObligatory" });
  const watchedAlternative = useWatch({
    control,
    name: "hasAlternativeSolution",
  });
  const watchedImpactUsers = useWatch({ control, name: "impactUsers" });

  useEffect(() => {
    if (!watchedImpactUsers || !watchedDomain) {
      setValue("impact", "", { shouldValidate: true });
      setValue("clientPriorityOverride", "", { shouldValidate: true });
      return;
    }

    const resolvedDomain = apiDomains?.find((d) => d.name === watchedDomain);
    if (!resolvedDomain) {
      return;
    }

    const impactNumberUsersId = mapImpactLevelToNumber(watchedImpactUsers);
    const obligation = watchedObligatory === "Yes";
    const existSolutionAlternative = watchedAlternative === "Yes";
    const benefitedList = Array.isArray(watchedBenefited)
      ? watchedBenefited
      : [];

    const timer = setTimeout(async () => {
      try {
        const result = await dispatch(
          calculateImpact({
            benefited_institutions: benefitedList,
            obligation,
            exist_solution_alternative: existSolutionAlternative,
            domain_in_charge_id: resolvedDomain.id,
            impact_number_users_id: impactNumberUsersId,
          }),
        ).unwrap();

        setValue("impact", String(result.impact), { shouldValidate: true });
        setValue("clientPriorityOverride", result.client_priority_name, {
          shouldValidate: true,
        });
      } catch {
        // Silently catch in-flight error
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [
    watchedDomain,
    watchedBenefited,
    watchedObligatory,
    watchedAlternative,
    watchedImpactUsers,
    apiDomains,
    dispatch,
    setValue,
  ]);

  const impactOptions = useMemo(() => {
    const defaultOptions = ["Low", "Medium", "High", "Very High"];
    if (!watchedDomain || !apiDomains || !apiImpactUsers) {
      return defaultOptions;
    }

    const resolvedDomain = apiDomains.find((d) => d.name === watchedDomain);
    if (!resolvedDomain) {
      return defaultOptions;
    }

    const domainImpact = apiImpactUsers.find(
      (item) => item.domain_uuid === resolvedDomain.uuid,
    );
    if (!domainImpact || !domainImpact.impact_users) {
      return defaultOptions;
    }

    const { LOW, MEDIUM, HIGH, VERY_HIGH } = domainImpact.impact_users;

    return [
      LOW ? `Low (${LOW.from}-${LOW.to})` : "Low",
      MEDIUM ? `Medium (${MEDIUM.from}-${MEDIUM.to})` : "Medium",
      HIGH ? `High (${HIGH.from}-${HIGH.to})` : "High",
      VERY_HIGH ? `Very High (${VERY_HIGH.from}-${VERY_HIGH.to})` : "Very High",
    ];
  }, [watchedDomain, apiDomains, apiImpactUsers]);

  useEffect(() => {
    if (!watchedImpactUsers) return;
    const currentLevel = mapImpactLevelToNumber(watchedImpactUsers);
    if (
      currentLevel >= 1 &&
      currentLevel <= 4 &&
      impactOptions[currentLevel - 1]
    ) {
      const newLabel = impactOptions[currentLevel - 1];
      if (newLabel !== watchedImpactUsers) {
        setValue("impactUsers", newLabel, { shouldValidate: true });
      }
    }
  }, [impactOptions, watchedImpactUsers, setValue]);

  const hasEnteredData = useCallback((): boolean => {
    const values = getValues();
    if (values.name && values.name.trim().length > 0) {
      return true;
    }
    if (
      Array.isArray(values.requestedBy)
        ? values.requestedBy.length > 0
        : Boolean(values.requestedBy && (values.requestedBy as string).trim().length > 0)
    ) {
      return true;
    }
    if (values.requestingInstitution && values.requestingInstitution.trim().length > 0) {
      return true;
    }
    if (values.type && values.type.trim().length > 0) {
      return true;
    }
    if (values.domain && values.domain.trim().length > 0) {
      return true;
    }
    if (Array.isArray(values.collaboratorDomains) && values.collaboratorDomains.length > 0) {
      return true;
    }
    if (Array.isArray(values.followerDomains) && values.followerDomains.length > 0) {
      return true;
    }
    if (Array.isArray(values.benefitedInstitutions) && values.benefitedInstitutions.length > 0) {
      return true;
    }
    if (Array.isArray(values.studyModalities) && values.studyModalities.length > 0) {
      return true;
    }
    if (values.isObligatory !== "No") {
      return true;
    }
    if (values.hasAlternativeSolution !== "No") {
      return true;
    }
    if (values.impactUsers && values.impactUsers.trim().length > 0) {
      return true;
    }
    if (values.complexityEffort && values.complexityEffort.trim().length > 0) {
      return true;
    }
    if (values.clientPriorityOverride && values.clientPriorityOverride.trim().length > 0) {
      return true;
    }
    if (values.status !== "Registered") {
      return true;
    }
    if (values.startDate && values.startDate.trim().length > 0) {
      return true;
    }
    if (values.finishDate && values.finishDate.trim().length > 0) {
      return true;
    }
    if (values.description && values.description.trim().length > 0) {
      const stripped = values.description.replace(/<[^>]*>/g, "").trim();
      if (stripped.length > 0) {
        return true;
      }
    }
    return false;
  }, [getValues]);

  useEffect(() => {
    if (!open) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasEnteredData()) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [open, hasEnteredData]);

  const forceClose = () => {
    reset(defaultValues);
    setMinimized(false);
    setDiscardDialogOpen(false);
    onClose();
  };

  const handleRequestClose = () => {
    if (hasEnteredData()) {
      setDiscardDialogOpen(true);
    } else {
      forceClose();
    }
  };

  const handleConfirmDiscard = () => {
    forceClose();
    showSnackbar("Requisition registration cancelled", "info");
  };

  const handleCancelDiscard = () => {
    setDiscardDialogOpen(false);
  };

  const onSubmit = async (values: RequirementFormValues) => {
    // Resolve requesting institution ID from backend reference data
    const resolvedInstitution = apiInstitutions?.find(
      (inst) => inst.name === values.requestingInstitution,
    );
    const requestingInstitutionId = resolvedInstitution?.id ?? 1;

    // Resolve domain in charge ID from backend reference data
    const resolvedDomain = apiDomains?.find(
      (d) => d.name === values.domain,
    );
    const domainInChargeId = resolvedDomain?.id ?? 1;

    // Resolve study modality ID (Virtual: 1, Presencial: 2, Virtual/Presencial: 3)
    const hasVirtual = values.studyModalities.includes("Virtual");
    const hasPresencial = values.studyModalities.includes("Presencial");
    const hasBoth =
      values.studyModalities.includes("Virtual/Presencial") ||
      (hasVirtual && hasPresencial);
    const studyModality = hasBoth ? 3 : hasPresencial ? 2 : 1;

    const requestedByList = Array.isArray(values.requestedBy)
      ? values.requestedBy
      : values.requestedBy
        ? [values.requestedBy]
        : [];

    const payload: CreateRequirementPayload = {
      name: values.name,
      description: values.description,
      requesting_institution_id: requestingInstitutionId,
      requested_by: requestedByList,
      benefited_institutions: values.benefitedInstitutions,
      study_modality: studyModality,
      impact_number_users_id: mapImpactLevelToNumber(
        values.impactUsers,
      ),
      obligation: values.isObligatory === "Yes",
      exist_solution_alternative: values.hasAlternativeSolution === "Yes",
      complexity_and_effort: mapComplexityToNumber(
        values.complexityEffort as ComplexityEffort,
      ),
      client_priority: values.clientPriorityOverride
        ? mapClientPriorityToNumber(
            values.clientPriorityOverride as ClientPriority,
          )
        : undefined,
      domain_in_charge_id: domainInChargeId,
      domains_collaborators: values.collaboratorDomains,
      followers_domains: values.followerDomains,
      status: mapStatusToNumber(values.status as RequirementStatus),
      start_date: values.startDate ? values.startDate : undefined,
      end_date: values.finishDate ? values.finishDate : undefined,
      type: mapTypeToNumber(values.type as RequirementType),
    };

    const actionResult = await dispatch(createRequirement(payload));

    if (createRequirement.fulfilled.match(actionResult)) {
      showSnackbar("Requisition registered successfully", "success");
      dispatch(fetchRequirements());
      onCreated();
      forceClose();
    } else {
      const errorMsg =
        typeof actionResult.payload === "string"
          ? actionResult.payload
          : "Unable to create requirement. Please check your inputs.";
      showSnackbar(errorMsg, "error");
    }
  };

  const onInvalid = () => {
    showSnackbar("Please fill all required fields correctly.", "warning");
  };

  const selectField = (props: SelectFieldHelperProps) => (
    <FormSelectField
      {...props}
      key={props.name}
      control={control}
      errors={errors}
    />
  );

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
      <Box
        className={styles.container}
        component="form"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
      >
        <DrawerHeader
          minimized={minimized}
          onToggleMinimize={() => setMinimized((value) => !value)}
          onClose={handleRequestClose}
        />
        <Box className={styles.scrollContent}>
          <Stack className={styles.formContent} spacing={2}>
            <TextField
              label="Name"
              {...register("name")}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            {selectField({
              name: "requestedBy",
              label: "Requested by",
              options: institutionOptions,
              multiple: true,
              onOpen: handleInstitutionsOpen,
              isLoading: isInstitutionsLoading,
            })}
            <Box className={styles.twoColumns}>
              {selectField({
                name: "requestingInstitution",
                label: "Requesting institution",
                options: institutionOptions,
                onOpen: handleInstitutionsOpen,
                isLoading: isInstitutionsLoading,
              })}
              {selectField({
                name: "type",
                label: "Type",
                options: requirementTypes,
              })}
            </Box>
            {selectField({
              name: "domain",
              label: "Domain",
              options: domainOptions,
              onOpen: handleDomainsOpen,
              isLoading: isDomainsLoading,
            })}
            <Box className={styles.twoColumns}>
              {selectField({
                name: "collaboratorDomains",
                label: "Collaborator domains",
                options: domainOptions,
                multiple: true,
                optional: true,
                onOpen: handleDomainsOpen,
                isLoading: isDomainsLoading,
              })}
              {selectField({
                name: "followerDomains",
                label: "Follower domains",
                options: domainOptions,
                multiple: true,
                optional: true,
                onOpen: handleDomainsOpen,
                isLoading: isDomainsLoading,
              })}
            </Box>

            <Typography className={styles.sectionTitle}>
              Beneficiaries and Scope
            </Typography>
            {selectField({
              name: "benefitedInstitutions",
              label: "Benefited institutions",
              options: benefitedInstitutionOptions,
              multiple: true,
              onOpen: handleInstitutionsOpen,
              isLoading: isInstitutionsLoading,
            })}
            <Box className={styles.twoColumns}>
              {selectField({
                name: "studyModalities",
                label: "Study modality",
                options: modalities,
                multiple: true,
              })}
              {selectField({
                name: "isObligatory",
                label: "Mandatory",
                options: yesNoOptions,
              })}
            </Box>
            {selectField({
              name: "hasAlternativeSolution",
              label: "Alternative solution exists",
              options: yesNoOptions,
            })}

            <Typography className={styles.sectionTitle}>
              Impact and Feasibility
            </Typography>
            <Box className={styles.twoColumns}>
              {selectField({
                name: "impactUsers",
                label: "Impact users",
                options: impactOptions,
                onOpen: handleImpactUsersOpen,
                isLoading: isImpactUsersLoading,
              })}
              <Controller
                name="impact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={
                      field.value !== undefined &&
                      field.value !== null &&
                      field.value !== ""
                        ? String(field.value)
                        : ""
                    }
                    label="Impact"
                    placeholder="-"
                    type="text"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: <InfoOutlinedIcon fontSize="small" />,
                      },
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    helperText="Auto-calculated"
                  />
                )}
              />
            </Box>
            <Box className={styles.twoColumns}>
              {selectField({
                name: "complexityEffort",
                label: "Complexity and effort",
                options: complexities,
              })}
              {selectField({
                name: "clientPriorityOverride",
                label: "Client priority",
                options: priorities,
                helperText: "Auto-calculated",
              })}
            </Box>
            {selectField({
              name: "status",
              label: "Status",
              options: statusOptions,
            })}

            <Typography className={styles.sectionTitle}>Timeline</Typography>
            <Box className={styles.twoColumns}>
              <TextField
                label="Start date"
                type="date"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                {...register("startDate")}
                error={Boolean(errors.startDate)}
                helperText={errors.startDate?.message ?? "Optional"}
              />
              <TextField
                label="Finish date"
                type="date"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                {...register("finishDate")}
                error={Boolean(errors.finishDate)}
                helperText={errors.finishDate?.message ?? "Optional"}
              />
            </Box>

            <Typography className={styles.sectionTitle}>Description</Typography>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <DescriptionEditor
                  value={field.value}
                  onChange={field.onChange}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Stack>
        </Box>
        <Divider />
        <Box className={styles.footer}>
          <Button
            type="button"
            onClick={handleRequestClose}
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Drawer>

      <DiscardDialog
        open={discardDialogOpen}
        onCancel={handleCancelDiscard}
        onConfirm={handleConfirmDiscard}
      />
    </>
  );
};
