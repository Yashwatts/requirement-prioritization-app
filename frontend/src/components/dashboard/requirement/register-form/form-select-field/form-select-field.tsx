"use client";

import { Controller, useFormContext, type Path } from "react-hook-form";
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import { useLocalization } from "@/localize";
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
  const { translate, locale } = useLocalization();
  const isSpanish = locale === "es-ES";
  const {
    control,
    formState: { errors },
  } = useFormContext<RequirementFormValues>();

  const errorMessage = errors[name]?.message as string | undefined;
  const optionalLabel = translate("optional");
  const requiredLabel = translate("required");

  const getOptionLabel = (option: FormSelectOption): string =>
    typeof option === "object" ? option.label : option;

  const getOptionValue = (option: FormSelectOption): string | number =>
    typeof option === "object" ? option.value : option;

  const isHalfWidth =
    name === "collaboratorDomains" ||
    name === "followerDomains" ||
    name === "studyModalities";
  const maxVisibleChips = isHalfWidth ? 2 : 4;

  return (
    <Controller
      key={name}
      name={name as Path<RequirementFormValues>}
      control={control}
      render={({ field }) => {
        const val = field.value;
        const isRegisteredStatus =
          name === "status" && (val === "Registered" || val === "Registrada");
        const hasSingleValue =
          !multiple && val !== undefined && val !== null && val !== "";
        const showClearButton = hasSingleValue && !isRegisteredStatus;
        const multipleArr = multiple
          ? Array.isArray(val)
            ? val
            : []
          : [];

        return (
          <FormControl
            className={styles.field}
            size="small"
            error={Boolean(errorMessage)}
          >
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
              {...field}
              size="small"
              value={multiple ? multipleArr : (val ?? "")}
              labelId={`${name}-label`}
              id={`${name}-select`}
              multiple={multiple}
              label={label}
              onOpen={onOpen}
              IconComponent={ArrowDropDownIcon}
              endAdornment={
                showClearButton ? (
                  <IconButton
                    size="small"
                    tabIndex={-1}
                    className={styles.clearButton}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (typeof window !== "undefined") {
                        window.getSelection()?.removeAllRanges();
                      }
                      field.onChange("");
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    aria-label="Clear selection"
                  >
                    <CloseIcon className={styles.clearIcon} />
                  </IconButton>
                ) : null
              }
              renderValue={(selected) => {
                if (multiple) {
                  const arr = selected as (string | number)[];
                  if (!arr || arr.length === 0) return "";
                  const visibleItems = arr.slice(0, maxVisibleChips);
                  const hiddenCount = arr.length - visibleItems.length;

                  return (
                    <Box className={styles.chipsContainer}>
                      {visibleItems.map((itemVal) => {
                        const matched = options.find(
                          (opt) => getOptionValue(opt) === itemVal,
                        );
                        const itemLabel = matched
                          ? getOptionLabel(matched)
                          : String(itemVal);
                        return (
                          <Chip
                            key={String(itemVal)}
                            label={itemLabel}
                            size="small"
                            className={styles.chip}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDelete={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (typeof window !== "undefined") {
                                window.getSelection()?.removeAllRanges();
                              }
                              const next = arr.filter((v) => v !== itemVal);
                              field.onChange(next);
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          />
                        );
                      })}
                      {hiddenCount > 0 && (
                        <span className={styles.moreCounter}>
                          {isSpanish
                            ? `(+${hiddenCount} más)`
                            : `(+${hiddenCount} More)`}
                        </span>
                      )}
                    </Box>
                  );
                }

                const matchedOption = options.find(
                  (opt) => getOptionValue(opt) === selected,
                );
                return matchedOption
                  ? getOptionLabel(matchedOption)
                  : String(selected ?? "");
              }}
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
                options.map((option) => {
                  const optVal = getOptionValue(option);
                  const optLabel = getOptionLabel(option);
                  const isSelected = multiple
                    ? multipleArr.includes(optVal as never)
                    : field.value === optVal;
                  return (
                    <MenuItem
                      key={String(optVal)}
                      value={optVal}
                      selected={isSelected}
                    >
                      {multiple && (
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          sx={{ mr: 1, p: 0 }}
                        />
                      )}
                      {optLabel}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem disabled value="">
                  <Typography variant="body2" color="text.secondary">
                    No options available
                  </Typography>
                </MenuItem>
              )}
            </Select>
            {(Boolean(errorMessage) ||
              optional ||
              Boolean(helperText)) && (
              <FormHelperText>
                {errorMessage
                  ? errorMessage === "required"
                    ? requiredLabel
                    : errorMessage
                  : (helperText ?? (optional ? optionalLabel : ""))}
              </FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};
