"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Box, FormHelperText } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import styles from "./form-date-picker.module.css";

dayjs.extend(updateLocale);
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
          const dateValue =
            value && dayjs(value).isValid() ? dayjs(value) : null;

          return (
            <DatePicker
              label={label}
              value={dateValue}
              format="YYYY-MM-DD"
              dayOfWeekFormatter={(date: Dayjs) => date.format("dd")[0]}
              onChange={(newValue: Dayjs | null) => {
                if (newValue && newValue.isValid()) {
                  onChange(newValue.format("YYYY-MM-DD"));
                } else {
                  onChange("");
                }
              }}
              slots={{
                openPickerIcon: CalendarTodayOutlinedIcon,
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
