"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import { useLocalization } from "@/localize";
import { FormSelectField } from "../form-select-field/form-select-field";
import {
  CLIENT_PRIORITIES,
  COMPLEXITY_EFFORTS,
  REQUIREMENT_STATUSES,
} from "@/types/requirement.types";
import styles from "./impact-feasibility.module.css";

interface ImpactFeasibilityProps {
  impactOptions: readonly { label: string; value: number }[];
  isImpactUsersLoading: boolean;
  onOpenImpactUsers: () => void;
}

export const ImpactFeasibility = ({
  impactOptions,
  isImpactUsersLoading,
  onOpenImpactUsers,
}: ImpactFeasibilityProps) => {
  const { translate } = useLocalization();
  const { control } = useFormContext<RequirementFormValues>();

  return (
    <Box className={styles.container}>
      <Typography className={styles.sectionTitle}>
        {translate("impactAndFeasibility")}
      </Typography>

      <Box className={styles.twoColumns}>
        <FormSelectField
          name="impactUsers"
          label={translate("userImpact")}
          options={impactOptions}
          onOpen={onOpenImpactUsers}
          isLoading={isImpactUsersLoading}
        />

        <Controller
          name="impact"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              className={styles.readOnlyField}
              value={
                field.value !== undefined &&
                field.value !== null &&
                field.value !== ""
                  ? String(field.value)
                  : "-"
              }
              label={translate("impact")}
              type="text"
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <Tooltip
                      title={
                        <Box className={styles.tooltipBox}>
                          <Typography className={styles.tooltipTitle}>
                            {translate("impactTooltipTitle")}
                          </Typography>
                          <Typography className={styles.tooltipMessage}>
                            {translate("impactTooltipMessage")}
                          </Typography>
                          <Typography className={styles.tooltipFormula}>
                            {translate("impactTooltipFormula")}
                          </Typography>
                        </Box>
                      }
                      placement="bottom-end"
                      arrow={false}
                      enterTouchDelay={0}
                      leaveDelay={100}
                      classes={{
                        popper: styles.tooltipPopper,
                        tooltip: styles.tooltipCard,
                      }}
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [14, 15],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <IconButton
                        size="small"
                        disableRipple
                        className={styles.infoIconButton}
                        aria-label={translate("impactTooltipTitle")}
                      >
                        <InfoOutlinedIcon className={styles.infoIcon} />
                      </IconButton>
                    </Tooltip>
                  ),
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          )}
        />
      </Box>

      <Box className={styles.twoColumns}>
        <FormSelectField
          name="complexityEffort"
          label={translate("complexityAndEffort")}
          options={COMPLEXITY_EFFORTS}
        />
        <FormSelectField
          name="clientPriorityOverride"
          label={translate("clientPriority")}
          options={CLIENT_PRIORITIES}
        />
      </Box>

      <Box className={styles.twoColumns}>
        <FormSelectField
          name="status"
          label={translate("status")}
          options={REQUIREMENT_STATUSES}
        />
        <Box />
      </Box>
    </Box>
  );
};
