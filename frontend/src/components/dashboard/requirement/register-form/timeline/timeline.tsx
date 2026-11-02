"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { esES, enUS } from "@mui/x-date-pickers/locales";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import { useLocalization } from "@/localize";
import { FormDatePicker } from "../form-date-picker/form-date-picker";
import styles from "./timeline.module.css";

export const Timeline = () => {
  const { translate, locale } = useLocalization();
  const {
    formState: { errors },
  } = useFormContext<RequirementFormValues>();

  const optionalLabel = translate("optional");
  const adapterLocale = locale === "es-ES" ? "es" : "en";
  const localeText = useMemo(() => {
    const baseLocaleText =
      locale === "es-ES"
        ? esES.components.MuiLocalizationProvider.defaultProps.localeText
        : enUS.components.MuiLocalizationProvider.defaultProps.localeText;

    return {
      ...baseLocaleText,
      fieldYearPlaceholder: (params: { digitAmount?: number }) =>
        params.digitAmount === 2
          ? locale === "es-ES"
            ? "AA"
            : "YY"
          : locale === "es-ES"
            ? "AAAA"
            : "YYYY",
    };
  }, [locale]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={adapterLocale}
      localeText={localeText}
    >
      <Box className={styles.container}>
        <Typography className={styles.sectionTitle}>
          {translate("timeline")}
        </Typography>

        <Box className={styles.twoColumns}>
          <FormDatePicker
            name="startDate"
            label={translate("startDate")}
            helperText={optionalLabel}
            error={errors.startDate?.message}
          />
          <FormDatePicker
            name="finishDate"
            label={translate("finishDate")}
            helperText={optionalLabel}
            error={errors.finishDate?.message}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
