"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Box, FormHelperText } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/en";
import "dayjs/locale/es";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import styles from "./form-date-picker.module.css";

dayjs.extend(updateLocale);
dayjs.extend(customParseFormat);
dayjs.updateLocale("en", { weekStart: 1 });
dayjs.updateLocale("es", { weekStart: 1 });

export interface FormDatePickerProps {
  name: "startDate" | "finishDate" | (string & {});
  label: string;
  helperText?: string;
  error?: string;
  className?: string;
}

export const FormDatePicker = ({
  name,
  label,
  helperText,
  error,
  className,
}: FormDatePickerProps) => {
  const { control } = useFormContext<RequirementFormValues>();

  return (
    <Box className={`${styles.fieldWrapper} ${className ?? ""}`.trim()}>
      <Controller
        name={name as "startDate" | "finishDate"}
        control={control}
        render={({ field: { value, onChange, onBlur } }) => {
          const dateValue = (() => {
            if (!value || typeof value !== "string") return null;
            const parsed = dayjs(value, ["YYYY-MM-DD", "YY-MM-DD"]);
            if (parsed.isValid()) return parsed;
            const fallback = dayjs(value);
            return fallback.isValid() ? fallback : null;
          })();

          return (
            <DatePicker
              label={label}
              value={dateValue}
              format="YY-MM-DD"
              dayOfWeekFormatter={(date: Dayjs) =>
                date.format("dd")[0].toUpperCase()
              }
              onChange={(newValue: Dayjs | null) => {
                if (newValue && newValue.isValid()) {
                  onChange(newValue.format("YYYY-MM-DD"));
                } else {
                  onChange("");
                }
              }}
              slots={{
                openPickerIcon: CalendarTodayOutlinedIcon,
                clearIcon: CloseIcon,
              }}
              slotProps={{
                textField: {
                  size: "small",
                  label,
                  onBlur,
                  error: Boolean(error),
                  className: styles.datePickerTextField,
                },
                openPickerButton: {
                  className: styles.calendarButton,
                  "aria-label": label,
                },
                field: {
                  clearable: true,
                },
                popper: {
                  className: styles.datePickerPopper,
                },
              }}
            />
          );
        }}
      />
      <FormHelperText
        className={`${styles.helperText} ${error ? styles.errorHelperText : ""}`}
      >
        {error ?? helperText}
      </FormHelperText>
    </Box>
  );
};
