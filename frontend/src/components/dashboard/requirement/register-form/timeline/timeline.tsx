"use client";

import { useFormContext } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import { useLocalization } from "@/localize";
import { FormDatePicker } from "../form-date-picker/form-date-picker";
import styles from "./timeline.module.css";

export const Timeline = () => {
  const { translate } = useLocalization();
  const {
    formState: { errors },
  } = useFormContext<RequirementFormValues>();

  const optionalLabel = translate("optional");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
