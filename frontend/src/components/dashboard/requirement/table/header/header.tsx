"use client";

import { Box, Button, Fab, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined";
import { useLocalization } from "@/localize";
import styles from "./header.module.css";

export interface HeaderProps {
  onCreateNew: () => void;
  isFormMinimized?: boolean;
  onRestoreForm?: () => void;
}

export const Header = ({
  onCreateNew,
  isFormMinimized = false,
  onRestoreForm,
}: HeaderProps) => {
  const { translate } = useLocalization();

  return (
    <Box className={styles.heading}>
      <Typography className={styles.title}>
        {translate("requirementsList")}
      </Typography>
      <Button className={styles.createButton} onClick={onCreateNew}>
        {translate("createNew")}
      </Button>
      <Box className={styles.fabContainer}>
        {isFormMinimized && (
          <Fab
            className={styles.minimizedFab}
            onClick={onRestoreForm}
            aria-label={translate("newRequirement")}
            size="small"
          >
            <RecentActorsOutlinedIcon className={styles.minimizedFabIcon} />
          </Fab>
        )}
        <Fab
          className={styles.fab}
          onClick={onCreateNew}
          aria-label={translate("createNew")}
        >
          <AddIcon className={styles.fabIcon} />
        </Fab>
      </Box>
    </Box>
  );
};
