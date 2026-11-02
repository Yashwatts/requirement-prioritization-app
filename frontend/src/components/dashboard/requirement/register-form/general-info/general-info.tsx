"use client";

import { useFormContext } from "react-hook-form";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import { useLocalization } from "@/localize";
import { FormSelectField } from "../form-select-field/form-select-field";
import { REQUIREMENT_TYPES } from "@/types/requirement.types";
import styles from "./general-info.module.css";

interface GeneralInfoProps {
  institutionOptions: readonly string[];
  domainOptions: readonly string[];
  isInstitutionsLoading: boolean;
  isDomainsLoading: boolean;
  onOpenInstitutions: () => void;
  onOpenDomains: () => void;
}

export const GeneralInfo = ({
  institutionOptions,
  domainOptions,
  isInstitutionsLoading,
  isDomainsLoading,
  onOpenInstitutions,
  onOpenDomains,
}: GeneralInfoProps) => {
  const { translate, locale } = useLocalization();
  const {
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<RequirementFormValues>();

  const nameVal = watch("name");
  const isSpanish = locale === "es-ES";

  return (
    <Box className={styles.container}>
      <TextField
        size="small"
        className={styles.textField}
        label={translate("name")}
        value={nameVal ?? ""}
        {...register("name", {
          onChange: (e) => {
            if (e.target.value && e.target.value.trim().length > 0 && errors.name) {
              clearErrors("name");
            }
          },
        })}
        error={Boolean(errors.name)}
        helperText={
          errors.name
            ? errors.name.message === "required"
              ? translate("required")
              : errors.name.message
            : undefined
        }
        slotProps={{
          input: {
            endAdornment: nameVal ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  tabIndex={-1}
                  onClick={() =>
                    setValue("name", "", {
                      shouldValidate: false,
                      shouldDirty: true,
                    })
                  }
                  edge="end"
                  className={styles.clearButton}
                  aria-label="Clear name"
                >
                  <CloseIcon className={styles.clearIcon} />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />

      <FormSelectField
        name="requestedBy"
        label={translate("requestedBy")}
        options={institutionOptions}
        multiple
        onOpen={onOpenInstitutions}
        isLoading={isInstitutionsLoading}
      />

      <Box className={styles.twoColumns}>
        <FormSelectField
          name="requestingInstitution"
          label={translate("requestingInstitution")}
          options={institutionOptions}
          onOpen={onOpenInstitutions}
          isLoading={isInstitutionsLoading}
        />
        <FormSelectField
          name="type"
          label={translate("type")}
          options={REQUIREMENT_TYPES}
        />
      </Box>

      <FormSelectField
        name="domain"
        label={translate("domain")}
        options={domainOptions}
        onOpen={onOpenDomains}
        isLoading={isDomainsLoading}
      />

      <Box className={styles.domainColumns}>
        {(isSpanish
          ? (["followerDomains", "collaboratorDomains"] as const)
          : (["collaboratorDomains", "followerDomains"] as const)
        ).map((fieldName) => (
          <FormSelectField
            key={fieldName}
            name={fieldName}
            label={translate(fieldName)}
            options={domainOptions}
            multiple
            optional
            onOpen={onOpenDomains}
            isLoading={isDomainsLoading}
          />
        ))}
      </Box>
    </Box>
  );
};
