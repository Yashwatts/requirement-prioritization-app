"use client";

import { Controller, type Control, type FieldErrors, type Path } from "react-hook-form";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import styles from "./create-requirement-drawer.module.css";

export interface FormSelectFieldProps {
  name: keyof RequirementFormValues;
  label: string;
  options: readonly string[];
  control: Control<RequirementFormValues>;
  errors: FieldErrors<RequirementFormValues>;
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
  control,
  errors,
  multiple = false,
  optional = false,
  helperText,
  onOpen,
  isLoading = false,
}: FormSelectFieldProps) => {
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <Controller
      key={name}
      name={name as Path<RequirementFormValues>}
      control={control}
      render={({ field }) => (
        <FormControl className={styles.field} error={Boolean(errorMessage)}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            {...field}
            value={
              multiple
                ? Array.isArray(field.value)
                  ? field.value
                  : []
                : (field.value ?? "")
            }
            labelId={`${name}-label`}
            id={`${name}-select`}
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
              options.map((option) => {
                const isSelected = multiple
                  ? Array.isArray(field.value) && field.value.includes(option)
                  : field.value === option;
                return (
                  <MenuItem key={option} value={option} selected={isSelected}>
                    {multiple && (
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        sx={{ mr: 1, p: 0 }}
                      />
                    )}
                    {option}
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
          {(errorMessage !== undefined || optional || Boolean(helperText)) && (
            <FormHelperText>
              {errorMessage ?? helperText ?? (optional ? "Optional" : "")}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
