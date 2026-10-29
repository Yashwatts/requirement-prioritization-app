"use client";

import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CloseIcon from "@mui/icons-material/Close";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import { useLocalization } from "@/localize";
import styles from "./timeline.module.css";

interface DateFieldItemProps {
  name: "startDate" | "finishDate";
  placeholder: string;
  helperText?: string;
  error?: string;
}

const DateFieldItem = ({
  name,
  placeholder,
  helperText,
  error,
}: DateFieldItemProps) => {
  const { register, watch, setValue } = useFormContext<RequirementFormValues>();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const val = watch(name);
  const hasValue = Boolean(val);

  const { ref: registerRef, onChange: formOnChange, ...rest } = register(name);

  const handleOpenPicker = () => {
    setIsFocused(true);
    try {
      inputRef.current?.showPicker();
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setIsFocused(false);
  };

  return (
    <Box className={styles.fieldWrapper}>
      <Box
        className={`${styles.inputBox} ${error ? styles.errorBox : ""} ${
          isFocused ? styles.focusedBox : ""
        }`}
        onClick={handleOpenPicker}
      >
        <input
          {...rest}
          ref={(el) => {
            registerRef(el);
            inputRef.current = el;
          }}
          type={isFocused || hasValue ? "date" : "text"}
          placeholder={placeholder}
          value={val ?? ""}
          onChange={(e) => {
            formOnChange(e);
            setValue(name, e.target.value, { shouldValidate: true, shouldDirty: true });
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (!e.target.value) {
              setValue(name, "", { shouldValidate: true });
            }
          }}
          className={styles.nativeInput}
        />

        <Box className={styles.actionsGroup}>
          {hasValue && (
            <button
              type="button"
              tabIndex={-1}
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Clear date"
            >
              <CloseIcon className={styles.clearIcon} />
            </button>
          )}

          <button
            type="button"
            tabIndex={-1}
            className={styles.calendarButton}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenPicker();
            }}
            aria-label="Open calendar"
          >
            <CalendarTodayOutlinedIcon className={styles.calendarIcon} />
          </button>
        </Box>
      </Box>

      <Typography
        className={`${styles.helperText} ${error ? styles.errorHelperText : ""}`}
      >
        {error ?? helperText}
      </Typography>
    </Box>
  );
};

export const Timeline = () => {
  const { translate } = useLocalization();
  const {
    formState: { errors },
  } = useFormContext<RequirementFormValues>();

  const optionalLabel = translate("optional");

  return (
    <Box className={styles.container}>
      <Typography className={styles.sectionTitle}>
        {translate("timeline")}
      </Typography>

      <Box className={styles.twoColumns}>
        <DateFieldItem
          name="startDate"
          placeholder={translate("startDate")}
          helperText={optionalLabel}
          error={errors.startDate?.message}
        />
        <DateFieldItem
          name="finishDate"
          placeholder={translate("finishDate")}
          helperText={optionalLabel}
          error={errors.finishDate?.message}
        />
      </Box>
    </Box>
  );
};
