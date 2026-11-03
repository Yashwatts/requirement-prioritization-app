"use client";

import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useLocalization } from "@/localize";
import styles from "./header.module.css";

export interface MobileSettingsHeaderProps {
  minimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
}

export const MobileSettingsHeader = ({
  minimized,
  onToggleMinimize,
  onClose,
}: MobileSettingsHeaderProps) => {
  const { translate } = useLocalization();

  return (
    <Box
      className={`${styles.header} ${minimized ? styles.minimizedHeader : ""}`}
    >
      <Typography className={styles.title}>
        {translate("setting") || "Setting"}
      </Typography>
      <Box className={styles.actions}>
        <IconButton
          aria-label={minimized ? "Open in full" : "Minimize"}
          size="small"
          onClick={onToggleMinimize}
          className={styles.actionButton}
        >
          {minimized ? (
            <OpenInFullIcon className={styles.actionIcon} />
          ) : (
            <RemoveIcon className={styles.actionIcon} />
          )}
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

