"use client";

import { Box, Typography } from "@mui/material";
import { useLocalization } from "@/localize";
import type { ColumnConfigItem } from "@/types/table-settings.types";
import { MobileViewItem } from "./view-item";
import styles from "./view-list.module.css";

export interface MobileViewListProps {
  allColumns: ColumnConfigItem[];
  columnVisibility: Record<string, boolean>;
  onToggleColumn: (columnItem: ColumnConfigItem) => void;
}

export const MobileViewList = ({
  allColumns,
  columnVisibility,
  onToggleColumn,
}: MobileViewListProps) => {
  const { translate } = useLocalization();

  return (
    <Box className={styles.viewSection}>
      <Typography className={styles.sectionTitle}>
        {translate("view") || "View"}
      </Typography>
      <Box className={styles.listContainer}>
        {allColumns.map((columnItem) => {
          const isVisible = columnVisibility[columnItem.id] !== false;
          return (
            <MobileViewItem
              key={columnItem.id}
              columnItem={columnItem}
              isChecked={isVisible}
              onToggle={onToggleColumn}
            />
          );
        })}
      </Box>
    </Box>
  );
};

