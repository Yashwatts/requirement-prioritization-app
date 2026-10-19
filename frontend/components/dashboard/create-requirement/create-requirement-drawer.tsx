"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
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

import { api } from "@/config/api";
import type {
  BenefitedInstitution,
  ClientPriority,
  ComplexityEffort,
  DomainArea,
  ManagementPriority,
  RequestingInstitution,
  RequirementType,
  StudyModality,
  UserImpactLevel,
} from "@/features/requirements/requirement.types";
import styles from "./create-requirement-drawer.module.css";

const institutions: RequestingInstitution[] = [
  "FUNIBER", "UNEATLANTICO", "UNIC", "UNINCOL", "UNIB", "UNINI-MX",
  "UNIROMANA", "UDAS", "Grupo Funiber", "Proyectos Europeos",
];
const benefitedInstitutions: BenefitedInstitution[] = institutions.filter(
  (institution): institution is BenefitedInstitution => institution !== "Grupo Funiber",
);
const domains: DomainArea[] = [
  "Financiero", "Reincorporaciones", "Ventas", "Marketing Digital", "Administración Académica",
  "Logística", "Maquetación", "Presencia Web", "Envíos Masivos", "Docencia Académica",
  "Catálogo Formativo", "Planificación Educativa", "Gestión Docente", "Acción Docente",
  "Calidad Universitaria", "Reportería", "ESEC", "Proyectos Europeos",
];
const requirementTypes: RequirementType[] = ["Internal", "External", "Client"];
const modalities: StudyModality[] = ["Virtual", "Presencial", "Virtual/Presencial"];
const impacts: UserImpactLevel[] = ["Low", "Medium", "High", "Very High"];
const complexities: ComplexityEffort[] = ["XS", "S", "M", "L", "XL"];
const priorities: ClientPriority[] = ["Low", "Medium", "High"];
const managementPriorities: ManagementPriority[] = ["Under", "Medium", "High", "Discarded"];

const requirementFormSchema = z.object({
  name: z.string().trim().min(1, "Required").max(255),
  requestedBy: z.string().trim().min(1, "Required").max(255),
  requestingInstitution: z.string().min(1, "Required"),
  type: z.string().min(1, "Required"),
  domain: z.string().min(1, "Required"),
  collaboratorDomains: z.array(z.string()),
  followerDomains: z.array(z.string()),
  benefitedInstitutions: z.array(z.string()).min(1, "Required"),
  studyModalities: z.array(z.string()).min(1, "Required"),
  isObligatory: z.boolean(),
  hasAlternativeSolution: z.boolean(),
  impactUsers: z.string().min(1, "Required"),
  impact: z.string().optional(),
  complexityEffort: z.string().min(1, "Required"),
  clientPriorityOverride: z.string().min(1, "Required"),
  managementPriority: z.string().min(1, "Required"),
  startDate: z.string().optional(),
  finishDate: z.string().optional(),
  description: z.string().trim().min(1, "Required").max(500),
});

type RequirementFormValues = z.infer<typeof requirementFormSchema>;

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
  managementPriority: "",
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
}

export const CreateRequirementDrawer = ({
  open,
  onClose,
  onCreated,
}: CreateRequirementDrawerProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);
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

  const close = () => {
    reset(defaultValues);
    setSubmitError(null);
    setMinimized(false);
    onClose();
  };

  const onSubmit = async (values: RequirementFormValues) => {
    setSubmitError(null);
    try {
      await api.post("/requirements", {
        ...values,
        impact: values.impact ? Number(values.impact) : undefined,
        requestingInstitution: values.requestingInstitution as RequestingInstitution,
        type: values.type as RequirementType,
        domain: values.domain as DomainArea,
        collaboratorDomains: values.collaboratorDomains as DomainArea[],
        followerDomains: values.followerDomains as DomainArea[],
        benefitedInstitutions: values.benefitedInstitutions as BenefitedInstitution[],
        studyModalities: values.studyModalities as StudyModality[],
        impactUsers: values.impactUsers as UserImpactLevel,
        complexityEffort: values.complexityEffort as ComplexityEffort,
        clientPriorityOverride: values.clientPriorityOverride as ClientPriority,
        managementPriority: values.managementPriority as ManagementPriority,
        startDate: values.startDate || undefined,
        finishDate: values.finishDate || undefined,
      });
      onCreated();
      close();
    } catch {
      setSubmitError("Unable to create requirement. Please try again.");
    }
  };

  const selectField = ({ name, label, options, multiple = false, optional = false }: SelectFieldProps) => (
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
            IconComponent={ArrowDropDownIcon}
            renderValue={multiple ? (selected) => (selected as string[]).join(", ") : undefined}
          >
            {options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
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
      <Box className={styles.container} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box className={styles.header}>
          <Typography className={styles.headerTitle}>New requirement</Typography>
          <Box className={styles.headerActions}>
            <IconButton
              aria-label={minimized ? "Open in full" : "Minimize"}
              size="small"
              onClick={() => setMinimized((value) => !value)}
            >
              {minimized ? <OpenInFullIcon /> : <MinimizeIcon />}
            </IconButton>
            <IconButton aria-label="Close" size="small" onClick={close}><CloseIcon /></IconButton>
          </Box>
        </Box>
        <Box className={styles.scrollContent}>
          {submitError && <Alert severity="error" className={styles.alert}>{submitError}</Alert>}
          <Stack className={styles.formContent} spacing={2}>
            <TextField label="Name" {...register("name")} error={Boolean(errors.name)} helperText={errors.name?.message} />
            <TextField label="Requested by" {...register("requestedBy")} error={Boolean(errors.requestedBy)} helperText={errors.requestedBy?.message} />
            <Box className={styles.twoColumns}>
              {selectField({ name: "requestingInstitution", label: "Requesting institution", options: institutions })}
              {selectField({ name: "type", label: "Type", options: requirementTypes })}
            </Box>
            {selectField({ name: "domain", label: "Domain", options: domains })}
            <Box className={styles.twoColumns}>
              {selectField({ name: "collaboratorDomains", label: "Collaborator domains", options: domains, multiple: true, optional: true })}
              {selectField({ name: "followerDomains", label: "Follower domains", options: domains, multiple: true, optional: true })}
            </Box>

            <Typography className={styles.sectionTitle}>Beneficiaries and Scope</Typography>
            {selectField({ name: "benefitedInstitutions", label: "Benefited institutions", options: benefitedInstitutions, multiple: true })}
            <Box className={styles.twoColumns}>
              {selectField({ name: "studyModalities", label: "Study modality", options: modalities, multiple: true })}
              <Controller name="isObligatory" control={control} render={({ field }) => <FormControlLabel className={styles.checkboxField} control={<Checkbox checked={field.value} onChange={field.onChange} />} label="Mandatory" />} />
            </Box>
            <Controller name="hasAlternativeSolution" control={control} render={({ field }) => <FormControlLabel className={styles.checkboxField} control={<Checkbox checked={field.value} onChange={field.onChange} />} label="Alternative solution exists" />} />

            <Typography className={styles.sectionTitle}>Impact and Feasibility</Typography>
            <Box className={styles.twoColumns}>
              {selectField({ name: "impactUsers", label: "User impact", options: impacts })}
              <TextField label="Impact" placeholder="-" type="number" {...register("impact")} slotProps={{ input: { endAdornment: <InfoOutlinedIcon fontSize="small" /> } }} />
            </Box>
            <Box className={styles.twoColumns}>
              {selectField({ name: "complexityEffort", label: "Complexity and effort", options: complexities })}
              {selectField({ name: "clientPriorityOverride", label: "Client priority", options: priorities })}
            </Box>
            {selectField({ name: "managementPriority", label: "Status", options: managementPriorities })}

            <Typography className={styles.sectionTitle}>Timeline</Typography>
            <Box className={styles.twoColumns}>
              <TextField label="Start date" type="date" slotProps={{ inputLabel: { shrink: true }, input: { endAdornment: <CalendarTodayOutlinedIcon fontSize="small" /> } }} {...register("startDate")} helperText="Optional" />
              <TextField label="Finish date" type="date" slotProps={{ inputLabel: { shrink: true }, input: { endAdornment: <CalendarTodayOutlinedIcon fontSize="small" /> } }} {...register("finishDate")} helperText="Optional" />
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
                  setValue("description", event.currentTarget.textContent ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
              <Box className={styles.editorToolbar}>
                <Button size="small"><FormatSizeIcon /></Button><Button size="small"><FormatBoldIcon /></Button><Button size="small"><FormatItalicIcon /></Button><Button size="small"><FormatUnderlinedIcon /></Button><Button size="small"><FormatListNumberedIcon /></Button><Button size="small"><FormatListBulletedIcon /></Button><Button size="small"><LinkIcon /></Button><Button size="small"><CodeIcon /></Button>
              </Box>
            </Box>
          </Stack>
        </Box>
        <Divider />
        <Box className={styles.footer}>
          <Button type="submit" disabled={isSubmitting} className={styles.submitButton}>Create</Button>
        </Box>
      </Box>
    </Drawer>
  );
};
