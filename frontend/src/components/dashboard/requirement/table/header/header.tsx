"use client";

import { Box, Button, Fab, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLocalization } from "@/localize";
import styles from "./header.module.css";

export interface HeaderProps {
  onCreateNew: () => void;
}

export const Header = ({ onCreateNew }: HeaderProps) => {
  const { translate } = useLocalization();

  return (
    <Box className={styles.heading}>
      <Typography className={styles.title}>
        {translate("requirementsList")}
      </Typography>
      <Button className={styles.createButton} onClick={onCreateNew}>
        {translate("createNew")}
      </Button>
      <Fab
        className={styles.fab}
        onClick={onCreateNew}
        aria-label={translate("createNew")}
      >
        <AddIcon className={styles.fabIcon} />
      </Fab>
    </Box>
  );
};
