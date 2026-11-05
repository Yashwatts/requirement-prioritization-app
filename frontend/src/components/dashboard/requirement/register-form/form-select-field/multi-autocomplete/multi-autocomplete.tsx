"use client";

import {
  Autocomplete,
  Checkbox,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { ChipList } from "@/shared/chip-list/chip-list";
import { useLocalization } from "@/localize";
import type { FormSelectOption } from "../form-select-field";
import styles from "./multi-autocomplete.module.css";

export interface MultiAutocompleteProps {
  name: string;
  label: string;
  options: readonly FormSelectOption[];
  value?: string | number | (string | number)[] | null;
  onChange: (value: (string | number)[]) => void;
  onOpen?: () => void;
  isLoading?: boolean;
  errorMessage?: string;
  onClearErrors?: () => void;
}

export const MultiAutocomplete = ({
  name,
  label,
  options,
  value,
  onChange,
  onOpen,
  isLoading = false,
  errorMessage,
  onClearErrors,
}: MultiAutocompleteProps) => {
  const { locale } = useLocalization();

  const getOptionLabel = (option: FormSelectOption): string =>
    typeof option === "object" ? option.label : option;

  const getOptionValue = (option: FormSelectOption): string | number =>
    typeof option === "object" ? option.value : option;

  const selectedValuesList = Array.isArray(value) ? value : [];

  const autocompleteValue = selectedValuesList.map((val) => {
    const matched = options.find(
      (candidateOption) =>
        String(getOptionValue(candidateOption)) === String(val),
    );
    return matched ?? (val as FormSelectOption);
  });

  return (
    <div className={styles.autocompleteWrapper}>
      <Autocomplete
        multiple
        id={`${name}-autocomplete`}
        options={options}
        value={autocompleteValue}
        onChange={(_, newOptions) => {
          const newValues = newOptions.map((opt) => getOptionValue(opt));
          onChange(newValues);
          if (newValues.length > 0 && errorMessage && onClearErrors) {
            onClearErrors();
          }
        }}
        onOpen={onOpen}
        loading={isLoading}
        disableCloseOnSelect
        getOptionLabel={(option) => getOptionLabel(option)}
        isOptionEqualToValue={(option, val) =>
          String(getOptionValue(option)) === String(getOptionValue(val))
        }
        popupIcon={<ArrowDropDownIcon className={styles.selectIcon} />}
        clearIcon={<CloseIcon className={styles.clearIcon} />}
        noOptionsText={
          locale === "es-ES"
            ? "No hay opciones disponibles"
            : "No options available"
        }
        loadingText={
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
          </Stack>
        }
        slotProps={{
          paper: {
            className: styles.menuPaper,
          },
        }}
        renderValue={(selectedItems) => {
          if (!selectedItems || selectedItems.length === 0) return null;
          const chipsToDisplay = selectedItems.map((opt) =>
            getOptionLabel(opt),
          );
          return (
            <ChipList
              items={chipsToDisplay}
              className={styles.autocompleteChipList}
            />
          );
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          const candidateOptionLabel = getOptionLabel(option);
          return (
            <li key={key} {...optionProps} className={styles.menuItemOption}>
              <Checkbox
                size="small"
                checked={selected}
                sx={{ mr: 1, p: 0 }}
              />
              {candidateOptionLabel}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            size="small"
            error={Boolean(errorMessage)}
          />
        )}
      />
    </div>
  );
};
