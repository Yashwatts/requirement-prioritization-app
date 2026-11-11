"use client";

import { Box, IconButton, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useLocalization } from "@/localize";
import styles from "./header.module.css";

interface HeaderProps {
  minimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export const Header = ({
  minimized,
  onToggleMinimize,
  onClose,
  isSubmitting,
}: HeaderProps) => {
  const { translate } = useLocalization();

  return (
    <Box
      className={`${styles.header} ${minimized ? styles.minimizedHeader : ""}`}
    >
      <Box className={styles.titleGroup}>
        <IconButton
          aria-label={translate("close")}
          size="small"
          onClick={onClose}
          className={styles.mobileCloseButton}
        >
          <CloseIcon />
        </IconButton>
        <Typography className={styles.title}>
          {translate("newRequirement")}
        </Typography>
      </Box>

      <Box className={styles.actions}>
        <IconButton
          aria-label={minimized ? "Open in full" : "Minimize"}
          size="small"
          onClick={onToggleMinimize}
          className={styles.actionButton}
        >
          {minimized ? <OpenInFullIcon /> : <RemoveIcon />}
        </IconButton>
        <IconButton
          aria-label={translate("save")}
          size="small"
          type="submit"
          disabled={isSubmitting}
          className={styles.mobileSubmitButton}
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          aria-label={translate("close")}
          size="small"
          onClick={onClose}
          className={styles.desktopCloseButton}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
