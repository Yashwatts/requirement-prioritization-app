"use client";

import { Controller, useFormContext, type Path } from "react-hook-form";
import { FormControl, FormHelperText } from "@mui/material";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import { useLocalization } from "@/localize";
import { SingleSelect } from "./single-select/single-select";
import { MultiAutocomplete } from "./multi-autocomplete/multi-autocomplete";
import styles from "./form-select-field.module.css";

export interface SelectOption {
  label: string;
  value: string | number;
}

export type FormSelectOption = string | SelectOption;

export interface FormSelectFieldProps {
  name: keyof RequirementFormValues;
  label: string;
  options: readonly FormSelectOption[];
  multiple?: boolean;
  optional?: boolean;
  helperText?: string;
  onOpen?: () => void;
  isLoading?: boolean;
}

export const FormSelectField = ({
  name,
  label,
  options,
  multiple = false,
  optional = false,
  helperText,
  onOpen,
  isLoading = false,
}: FormSelectFieldProps) => {
  const { translate } = useLocalization();
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext<RequirementFormValues>();

  const errorMessage = errors[name]?.message as string | undefined;
  const optionalLabel = translate("optional");
  const requiredLabel = translate("required");

  const fieldWidthClass =
    name === "collaboratorDomains"
      ? styles.collaboratorField
      : name === "followerDomains"
        ? styles.followerField
        : "";

  return (
    <Controller
      key={name}
      name={name as Path<RequirementFormValues>}
      control={control}
      render={({ field }) => (
        <FormControl
          className={`${styles.field} ${fieldWidthClass}`.trim()}
          size="small"
          error={Boolean(errorMessage)}
        >
          {multiple ? (
            <MultiAutocomplete
              name={name}
              label={label}
              options={options}
              value={field.value}
              onChange={field.onChange}
              onOpen={onOpen}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onClearErrors={() =>
                clearErrors(name as Path<RequirementFormValues>)
              }
            />
          ) : (
            <SingleSelect
              name={name}
              label={label}
              options={options}
              value={field.value}
              onChange={field.onChange}
              onOpen={onOpen}
              isLoading={isLoading}
            />
          )}

          {(Boolean(errorMessage) || optional || Boolean(helperText)) && (
            <FormHelperText>
              {errorMessage
                ? errorMessage === "required"
                  ? requiredLabel
                  : errorMessage
                : (helperText ?? (optional ? optionalLabel : ""))}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
