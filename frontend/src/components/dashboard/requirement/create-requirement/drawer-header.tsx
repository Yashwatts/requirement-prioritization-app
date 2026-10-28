"use client";

import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import styles from "./create-requirement-drawer.module.css";

interface DrawerHeaderProps {
  minimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
}

export const DrawerHeader = ({
  minimized,
  onToggleMinimize,
  onClose,
}: DrawerHeaderProps) => {
  return (
    <Box className={styles.header}>
      <Typography className={styles.headerTitle}>New requirement</Typography>
      <Box className={styles.headerActions}>
        <IconButton
          aria-label={minimized ? "Open in full" : "Minimize"}
          size="small"
          onClick={onToggleMinimize}
          className={styles.headerIconButton}
        >
          {minimized ? <OpenInFullIcon /> : <MinimizeIcon />}
        </IconButton>
        <IconButton
          aria-label="Close"
          size="small"
          onClick={onClose}
          className={styles.headerIconButton}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
