"use client";

import { Box, Checkbox, Typography } from "@mui/material";
import type { ColumnConfigItem } from "@/types/table-settings.types";
import styles from "./view-list.module.css";

export interface MobileViewItemProps {
  columnItem: ColumnConfigItem;
  isChecked: boolean;
  onToggle: (columnItem: ColumnConfigItem) => void;
}

export const MobileViewItem = ({
  columnItem,
  isChecked,
  onToggle,
}: MobileViewItemProps) => {
  return (
    <Box className={styles.viewItem} onClick={() => onToggle(columnItem)}>
      <Box className={styles.checkboxContainer}>
        <Checkbox
          size="medium"
          checked={isChecked}
          className={styles.checkbox}
          onChange={() => onToggle(columnItem)}
          onClick={(clickEvent) => clickEvent.stopPropagation()}
        />
      </Box>
      <Typography className={styles.itemLabel}>{columnItem.label}</Typography>
    </Box>
  );
};

