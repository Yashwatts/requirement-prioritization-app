"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkIcon from "@mui/icons-material/Link";
import CodeIcon from "@mui/icons-material/Code";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSnackbar } from "@/components/snackbar/use-snackbar";
import {
  createRequirement,
  fetchReferenceData,
  fetchRequirements,
} from "@/features/requirements/requirement.action";
import {
  mapClientPriorityToNumber,
  mapComplexityToNumber,
  mapImpactLevelToNumber,
  mapManagementPriorityToNumber,
  mapTypeToNumber,
} from "@/features/requirements/mappers/requirement.mapper";
import type {
  BenefitedInstitution,
  ClientPriority,
  ComplexityEffort,
  CreateRequirementPayload,
  DomainArea,
  ManagementPriority,
  RequestingInstitution,
  RequirementType,
  StudyModality,
  UserImpactLevel,
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
const impacts: UserImpactLevel[] = ["Low", "Medium", "High", "Very High"];
const complexities: ComplexityEffort[] = ["XS", "S", "M", "L", "XL"];
const priorities: ClientPriority[] = ["Low", "Medium", "High"];
const managementPriorities: ManagementPriority[] = [
  "Under",
  "Medium",
  "High",
  "Discarded",
];

const defaultValues: RequirementFormValues = {
  name: "",
  requestedBy: "",
  requestingInstitution: "",
  type: "",
  domain: "",
  collaboratorDomains: [],
  followerDomains: [],
  benefitedInstitutions: [],
  studyModalities: [],
  isObligatory: false,
  hasAlternativeSolution: false,
  impactUsers: "",
  impact: "",
  complexityEffort: "",
  clientPriorityOverride: "",
  managementPriority: "Under",
  startDate: "",
  finishDate: "",
  description: "",
};

interface CreateRequirementDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface SelectFieldProps {
  name: keyof RequirementFormValues;
  label: string;
  options: readonly string[];
  multiple?: boolean;
  optional?: boolean;
  onOpen?: () => void;
  isLoading?: boolean;
}

export const CreateRequirementDrawer = ({
  open,
  onClose,
  onCreated,
}: CreateRequirementDrawerProps) => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  const {
    institutions: apiInstitutions,
    domains: apiDomains,
    referenceDataStatus,
  } = useAppSelector((state) => state.requirements);

  const [minimized, setMinimized] = useState(false);

  // Trigger reference data fetch only when a dropdown is opened
  const handleReferenceDataOpen = () => {
    if (referenceDataStatus === "idle") {
      dispatch(fetchReferenceData());
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

  const isReferenceDataLoading = referenceDataStatus === "loading";

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequirementFormValues>({
    resolver: zodResolver(requirementFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  // Watch fields contributing to impact calculation
  const benefitedInstitutions = useWatch({
    control,
    name: "benefitedInstitutions",
  });
  const isObligatory = useWatch({ control, name: "isObligatory" });
  const hasAlternativeSolution = useWatch({
    control,
    name: "hasAlternativeSolution",
  });
  const impactUsers = useWatch({ control, name: "impactUsers" });

  // Auto-calculate impact according to SRS formula:
  // Impact = Total Benefited Institutions + Obligation (8) + No Alternative Solution (8) + Impact User Level (1-4)
  useEffect(() => {
    if (!impactUsers) return;

    const benefitedCount = Array.isArray(benefitedInstitutions)
      ? benefitedInstitutions.length
      : 0;
    const obligationVal = isObligatory ? 8 : 0;
    const alternativeSolutionVal = hasAlternativeSolution ? 0 : 8;
    const userImpactVal =
      impactUsers === "Low"
        ? 1
        : impactUsers === "Medium"
          ? 2
          : impactUsers === "High"
            ? 3
            : impactUsers === "Very High"
              ? 4
              : 1;

    const calculatedImpact =
      benefitedCount + obligationVal + alternativeSolutionVal + userImpactVal;

    setValue("impact", String(calculatedImpact), { shouldValidate: true });

    // Suggest default client priority based on SRS tiers
    const suggestedPriority: ClientPriority =
      calculatedImpact <= 10
        ? "Low"
        : calculatedImpact <= 20
          ? "Medium"
          : "High";
    setValue("clientPriorityOverride", suggestedPriority, {
      shouldValidate: true,
    });
  }, [
    benefitedInstitutions,
    isObligatory,
    hasAlternativeSolution,
    impactUsers,
    setValue,
  ]);

  const close = () => {
    reset(defaultValues);
    setMinimized(false);
    onClose();
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

    // Format requested_by array from string (split by comma if multiple)
    const requestedByList = values.requestedBy
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload: CreateRequirementPayload = {
      name: values.name,
      description: values.description,
      requesting_institution_id: requestingInstitutionId,
      requested_by: requestedByList,
      benefited_institutions: values.benefitedInstitutions,
      study_modality: studyModality,
      impact_number_users_id: mapImpactLevelToNumber(
        values.impactUsers as UserImpactLevel,
      ),
      obligation: values.isObligatory,
      exist_solution_alternative: values.hasAlternativeSolution,
      complexity_and_effort: mapComplexityToNumber(
        values.complexityEffort as ComplexityEffort,
      ),
      client_priority: values.clientPriorityOverride
        ? mapClientPriorityToNumber(
            values.clientPriorityOverride as ClientPriority,
          )
        : undefined,
      management_priority: values.managementPriority
        ? mapManagementPriorityToNumber(
            values.managementPriority as ManagementPriority,
          )
        : 1,
      domain_in_charge_id: domainInChargeId,
      domains_collaborators: values.collaboratorDomains,
      followers_domains: values.followerDomains,
      start_date: values.startDate || undefined,
      end_date: values.finishDate || undefined,
      type: mapTypeToNumber(values.type as RequirementType),
    };

    const actionResult = await dispatch(createRequirement(payload));

    if (createRequirement.fulfilled.match(actionResult)) {
      showSnackbar("Requirement registered successfully.", "success");
      dispatch(fetchRequirements());
      onCreated();
      close();
    } else {
      const errorMsg =
        (actionResult.payload as string) ||
        "Unable to create requirement. Please check your inputs.";
      showSnackbar(errorMsg, "error");
    }
  };

  const onInvalid = () => {
    showSnackbar("Please fill all required fields correctly.", "warning");
  };

  const selectField = ({
    name,
    label,
    options,
    multiple = false,
    optional = false,
    onOpen,
    isLoading = false,
  }: SelectFieldProps) => (
    <Controller
      key={name}
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl className={styles.field} error={Boolean(errors[name])}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            multiple={multiple}
            label={label}
            onOpen={onOpen}
            IconComponent={ArrowDropDownIcon}
            renderValue={
              multiple
                ? (selected) => (selected as string[]).join(", ")
                : undefined
            }
          >
            {isLoading ? (
              <Stack spacing={1} sx={{ p: 1, minWidth: 200 }}>
                <Skeleton
                  variant="rectangular"
                  height={32}
                  animation="wave"
                  sx={{ borderRadius: 1, bgcolor: "rgba(0, 0, 0, 0.04)" }}
                />
                <Skeleton
                  variant="rectangular"
                  height={32}
                  animation="wave"
                  sx={{ borderRadius: 1, bgcolor: "rgba(0, 0, 0, 0.04)" }}
                />
                <Skeleton
                  variant="rectangular"
                  height={32}
                  animation="wave"
                  sx={{ borderRadius: 1, bgcolor: "rgba(0, 0, 0, 0.04)" }}
                />
              </Stack>
            ) : options.length > 0 ? (
              options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                <Typography variant="body2" color="text.secondary">
                  No options available
                </Typography>
              </MenuItem>
            )}
          </Select>
          {(errors[name]?.message || optional) && (
            <FormHelperText>
              {errors[name]?.message ?? "Optional"}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
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
        <Box className={styles.header}>
          <Typography className={styles.headerTitle}>
            New requirement
          </Typography>
          <Box className={styles.headerActions}>
            <IconButton
              aria-label={minimized ? "Open in full" : "Minimize"}
              size="small"
              onClick={() => setMinimized((value) => !value)}
            >
              {minimized ? <OpenInFullIcon /> : <MinimizeIcon />}
            </IconButton>
            <IconButton aria-label="Close" size="small" onClick={close}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box className={styles.scrollContent}>
          <Stack className={styles.formContent} spacing={2}>
            <TextField
              label="Name"
              {...register("name")}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <TextField
              label="Requested by"
              {...register("requestedBy")}
              error={Boolean(errors.requestedBy)}
              helperText={errors.requestedBy?.message}
            />
            <Box className={styles.twoColumns}>
              {selectField({
                name: "requestingInstitution",
                label: "Requesting institution",
                options: institutionOptions,
                onOpen: handleReferenceDataOpen,
                isLoading: isReferenceDataLoading,
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
              onOpen: handleReferenceDataOpen,
              isLoading: isReferenceDataLoading,
            })}
            <Box className={styles.twoColumns}>
              {selectField({
                name: "collaboratorDomains",
                label: "Collaborator domains",
                options: domainOptions,
                multiple: true,
                optional: true,
                onOpen: handleReferenceDataOpen,
                isLoading: isReferenceDataLoading,
              })}
              {selectField({
                name: "followerDomains",
                label: "Follower domains",
                options: domainOptions,
                multiple: true,
                optional: true,
                onOpen: handleReferenceDataOpen,
                isLoading: isReferenceDataLoading,
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
              onOpen: handleReferenceDataOpen,
              isLoading: isReferenceDataLoading,
            })}
            <Box className={styles.twoColumns}>
              {selectField({
                name: "studyModalities",
                label: "Study modality",
                options: modalities,
                multiple: true,
              })}
              <Controller
                name="isObligatory"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    className={styles.checkboxField}
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label="Mandatory"
                  />
                )}
              />
            </Box>
            <Controller
              name="hasAlternativeSolution"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  className={styles.checkboxField}
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label="Alternative solution exists"
                />
              )}
            />

            <Typography className={styles.sectionTitle}>
              Impact and Feasibility
            </Typography>
            <Box className={styles.twoColumns}>
              {selectField({
                name: "impactUsers",
                label: "User impact",
                options: impacts,
              })}
              <TextField
                label="Impact"
                placeholder="-"
                type="text"
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: <InfoOutlinedIcon fontSize="small" />,
                  },
                }}
                {...register("impact")}
                helperText="Auto-calculated (SRS formula)"
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
              })}
            </Box>
            {selectField({
              name: "managementPriority",
              label: "Status",
              options: managementPriorities,
            })}

            <Typography className={styles.sectionTitle}>Timeline</Typography>
            <Box className={styles.twoColumns}>
              <TextField
                label="Start date"
                type="date"
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    endAdornment: (
                      <CalendarTodayOutlinedIcon fontSize="small" />
                    ),
                  },
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
                  input: {
                    endAdornment: (
                      <CalendarTodayOutlinedIcon fontSize="small" />
                    ),
                  },
                }}
                {...register("finishDate")}
                error={Boolean(errors.finishDate)}
                helperText={errors.finishDate?.message ?? "Optional"}
              />
            </Box>

            <Typography className={styles.sectionTitle}>Description</Typography>
            <Box className={styles.editor}>
              <Box
                className={styles.editorBody}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-label="Description"
                onInput={(event) =>
                  setValue(
                    "description",
                    event.currentTarget.textContent ?? "",
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    },
                  )
                }
              />
              <Box className={styles.editorToolbar}>
                <Button size="small">
                  <FormatSizeIcon />
                </Button>
                <Button size="small">
                  <FormatBoldIcon />
                </Button>
                <Button size="small">
                  <FormatItalicIcon />
                </Button>
                <Button size="small">
                  <FormatUnderlinedIcon />
                </Button>
                <Button size="small">
                  <FormatListNumberedIcon />
                </Button>
                <Button size="small">
                  <FormatListBulletedIcon />
                </Button>
                <Button size="small">
                  <LinkIcon />
                </Button>
                <Button size="small">
                  <CodeIcon />
                </Button>
              </Box>
            </Box>
            {errors.description && (
              <Typography color="error" variant="caption" sx={{ ml: 1.5 }}>
                {errors.description.message}
              </Typography>
            )}
          </Stack>
        </Box>
        <Divider />
        <Box className={styles.footer}>
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
  );
};
