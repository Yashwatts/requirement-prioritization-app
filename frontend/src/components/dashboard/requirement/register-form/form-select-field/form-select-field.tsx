"use client";

import { Controller, useFormContext, type Path } from "react-hook-form";
import {
  Checkbox,
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
import { ChipList } from "@/shared/chip-list/chip-list";
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
  const { translate } = useLocalization();
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

  return (
    <Controller
      key={name}
      name={name as Path<RequirementFormValues>}
      control={control}
      render={({ field }) => {
        const currentFieldValue = field.value;
        const hasSingleValue =
          !multiple &&
          currentFieldValue !== undefined &&
          currentFieldValue !== null &&
          currentFieldValue !== "";
        const selectedValuesList = multiple
          ? Array.isArray(currentFieldValue)
            ? currentFieldValue
            : []
          : [];
        const hasMultipleValue =
          multiple && selectedValuesList.length > 0;
        const showClearButton = hasSingleValue || hasMultipleValue;

        const fieldWidthClass =
          name === "collaboratorDomains"
            ? styles.collaboratorField
            : name === "followerDomains"
              ? styles.followerField
              : "";

        return (
          <FormControl
            className={`${styles.field} ${fieldWidthClass}`}
            size="small"
            error={Boolean(errorMessage)}
          >
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
              {...field}
              size="small"
              value={multiple ? selectedValuesList : (currentFieldValue ?? "")}
              labelId={`${name}-label`}
              id={`${name}-select`}
              multiple={multiple}
              label={label}
              onOpen={onOpen}
              IconComponent={ArrowDropDownIcon}
              MenuProps={{
                slotProps: {
                  paper: {
                    className: styles.menuPaper,
                    style: {
                      maxHeight: 376,
                    },
                  },
                },
              }}
              endAdornment={
                showClearButton ? (
                  <IconButton
                    size="small"
                    tabIndex={-1}
                    className={styles.clearButton}
                    onClick={(clickEvent) => {
                      clickEvent.preventDefault();
                      clickEvent.stopPropagation();
                      if (typeof window !== "undefined") {
                        window.getSelection()?.removeAllRanges();
                      }
                      field.onChange(multiple ? [] : "");
                    }}
                    onMouseDown={(mouseDownEvent) => {
                      mouseDownEvent.preventDefault();
                      mouseDownEvent.stopPropagation();
                    }}
                    aria-label="Clear selection"
                  >
                    <CloseIcon className={styles.clearIcon} />
                  </IconButton>
                ) : null
              }
              renderValue={(selectedValue) => {
                if (multiple) {
                  const selectedItemsArray = selectedValue as (
                    | string
                    | number
                  )[];
                  if (!selectedItemsArray || selectedItemsArray.length === 0) {
                    return "";
                  }
                  const chipsToDisplay = selectedItemsArray.map(
                    (individualItemValue) => {
                      const matchedOption = options.find(
                        (candidateOption) =>
                          String(getOptionValue(candidateOption)) ===
                          String(individualItemValue),
                      );
                      return matchedOption
                        ? getOptionLabel(matchedOption)
                        : String(individualItemValue);
                    },
                  );

                  return (
                    <ChipList
                      items={chipsToDisplay}
                      className={styles.formChipList}
                    />
                  );
                }

                const matchedOption = options.find(
                  (candidateOption) =>
                    String(getOptionValue(candidateOption)) ===
                    String(selectedValue),
                );
                if (matchedOption) {
                  return getOptionLabel(matchedOption);
                }
                if (
                  selectedValue === "" ||
                  selectedValue === null ||
                  selectedValue === undefined
                ) {
                  return "";
                }
                if (name === "impactUsers") {
                  const numericVal = Number(selectedValue);
                  if (numericVal === 1) return "Low";
                  if (numericVal === 2) return "Medium";
                  if (numericVal === 3) return "High";
                  if (numericVal === 4) return "Very High";
                }
                return String(selectedValue);
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
                options.map((candidateOption) => {
                  const candidateOptionValue =
                    getOptionValue(candidateOption);
                  const candidateOptionLabel =
                    getOptionLabel(candidateOption);
                  const isOptionSelected = multiple
                    ? selectedValuesList.some(
                        (selectedItem) =>
                          String(selectedItem) ===
                          String(candidateOptionValue),
                      )
                    : String(field.value) === String(candidateOptionValue);
                  return (
                    <MenuItem
                      key={String(candidateOptionValue)}
                      value={candidateOptionValue}
                      selected={isOptionSelected}
                    >
                      {multiple && (
                        <Checkbox
                          size="small"
                          checked={isOptionSelected}
                          sx={{ mr: 1, p: 0 }}
                        />
                      )}
                      {candidateOptionLabel}
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
