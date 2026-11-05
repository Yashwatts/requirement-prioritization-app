"use client";

import {
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
import type { FormSelectOption } from "../form-select-field";
import styles from "./single-select.module.css";

export interface SingleSelectProps {
  name: string;
  label: string;
  options: readonly FormSelectOption[];
  value?: string | number | string[] | null;
  onChange: (value: string | number) => void;
  onOpen?: () => void;
  isLoading?: boolean;
}

export const SingleSelect = ({
  name,
  label,
  options,
  value,
  onChange,
  onOpen,
  isLoading = false,
}: SingleSelectProps) => {
  const getOptionLabel = (option: FormSelectOption): string =>
    typeof option === "object" ? option.label : option;

  const getOptionValue = (option: FormSelectOption): string | number =>
    typeof option === "object" ? option.value : option;

  const singleValue = Array.isArray(value) ? "" : (value ?? "");
  const hasValue = singleValue !== "";

  return (
    <div className={styles.selectField}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        size="small"
        fullWidth
        value={singleValue}
        onChange={(e) => onChange(e.target.value)}
        labelId={`${name}-label`}
        id={`${name}-select`}
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
          hasValue ? (
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
                onChange("");
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
          const matchedOption = options.find(
            (candidateOption) =>
              String(getOptionValue(candidateOption)) === String(selectedValue),
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
              sx={{
                borderRadius: 1,
                bgcolor: "rgba(0, 0, 0, 0.04)",
              }}
            />
            <Skeleton
              variant="rectangular"
              height={32}
              animation="wave"
              sx={{
                borderRadius: 1,
                bgcolor: "rgba(0, 0, 0, 0.04)",
              }}
            />
            <Skeleton
              variant="rectangular"
              height={32}
              animation="wave"
              sx={{
                borderRadius: 1,
                bgcolor: "rgba(0, 0, 0, 0.04)",
              }}
            />
          </Stack>
        ) : options.length > 0 ? (
          options.map((candidateOption) => {
            const candidateOptionValue = getOptionValue(candidateOption);
            const candidateOptionLabel = getOptionLabel(candidateOption);
            const isOptionSelected =
              String(value) === String(candidateOptionValue);
            return (
              <MenuItem
                key={String(candidateOptionValue)}
                value={candidateOptionValue}
                selected={isOptionSelected}
              >
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
    </div>
  );
};
