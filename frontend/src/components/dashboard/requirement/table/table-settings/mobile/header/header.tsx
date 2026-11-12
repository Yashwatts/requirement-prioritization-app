"use client";

import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import { useLocalization } from "@/localize";
import styles from "./header.module.css";

export interface MobileSettingsHeaderProps {
  onClose: () => void;
}

export const MobileSettingsHeader = ({
  onClose,
}: MobileSettingsHeaderProps) => {
  const { translate } = useLocalization();

  return (
    <Box className={styles.header}>
      <Typography className={styles.title}>
        {translate("setting") || "Setting"}
      </Typography>
      <Box className={styles.actions}>
        <IconButton
          aria-label="Minimize"
          size="small"
          disableRipple
          tabIndex={-1}
          className={styles.displayOnlyButton}
        >
          <RemoveIcon className={styles.actionIcon} />
        </IconButton>
        <IconButton
          aria-label="Close"
          size="small"
          onClick={onClose}
          className={styles.actionButton}
        >
          <CloseIcon className={styles.actionIcon} />
        </IconButton>
      </Box>
    </Box>
  );
};

