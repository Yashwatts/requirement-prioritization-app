"use client";

import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  ColumnConfigItem,
  TableSettingsDialogProps,
} from "@/types/table-settings.types";
import { MobileSettingsHeader } from "./header/header";
import { MobilePositionList } from "./position-list/position-list";
import { MobileViewList } from "./view-list/view-list";
import styles from "./table-settings-drawer.module.css";

export const TableSettingsDrawer = ({
  open,
  onClose,
  availableColumns,
  columnOrder,
  columnVisibility,
  onSave,
}: TableSettingsDialogProps) => {
  const initialColumnLists = useMemo(() => {
    const visibleList: ColumnConfigItem[] = [];
    const hiddenList: ColumnConfigItem[] = [];

    availableColumns.forEach((columnItem) => {
      const isVisible = columnVisibility[columnItem.id] !== false;
      if (isVisible) {
        visibleList.push(columnItem);
      } else {
        hiddenList.push(columnItem);
      }
    });

    if (columnOrder && columnOrder.length > 0) {
      visibleList.sort((firstColumn, secondColumn) => {
        const firstIndex = columnOrder.indexOf(firstColumn.id);
        const secondIndex = columnOrder.indexOf(secondColumn.id);
        if (firstIndex === -1 && secondIndex === -1) return 0;
        if (firstIndex === -1) return 1;
        if (secondIndex === -1) return -1;
        return firstIndex - secondIndex;
      });

      hiddenList.sort((firstColumn, secondColumn) => {
        const firstIndex = columnOrder.indexOf(firstColumn.id);
        const secondIndex = columnOrder.indexOf(secondColumn.id);
        if (firstIndex === -1 && secondIndex === -1) return 0;
        if (firstIndex === -1) return 1;
        if (secondIndex === -1) return -1;
        return firstIndex - secondIndex;
      });
    }

    return { visibleList, hiddenList };
  }, [availableColumns, columnOrder, columnVisibility]);

  const [visibleColumns, setVisibleColumns] = useState<ColumnConfigItem[]>(
    () => initialColumnLists.visibleList,
  );
  const [hiddenColumns, setHiddenColumns] = useState<ColumnConfigItem[]>(
    () => initialColumnLists.hiddenList,
  );

  useEffect(() => {
    setVisibleColumns(initialColumnLists.visibleList);
    setHiddenColumns(initialColumnLists.hiddenList);
  }, [initialColumnLists]);

  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  const handleReorderColumns = (
    sourceColumnIndex: number,
    targetColumnIndex: number,
  ) => {
    const updatedVisibleColumns = arrayMove(
      visibleColumns,
      sourceColumnIndex,
      targetColumnIndex,
    );
    setVisibleColumns(updatedVisibleColumns);

    const newColumnOrder = [
      "mrt-row-select",
      ...updatedVisibleColumns.map((columnItem) => columnItem.id),
      ...hiddenColumns.map((columnItem) => columnItem.id),
      "mrt-row-actions",
    ];

    onSave(newColumnOrder, columnVisibility);
  };

  const handleToggleColumn = (toggledColumn: ColumnConfigItem) => {
    const isCurrentlyVisible = columnVisibility[toggledColumn.id] !== false;

    let updatedVisibleColumns: ColumnConfigItem[];
    let updatedHiddenColumns: ColumnConfigItem[];
    const updatedVisibility: Record<string, boolean> = {
      ...columnVisibility,
      [toggledColumn.id]: !isCurrentlyVisible,
    };

    if (isCurrentlyVisible) {
      // Move from visible to hidden
      updatedVisibleColumns = visibleColumns.filter(
        (columnItem) => columnItem.id !== toggledColumn.id,
      );
      updatedHiddenColumns = [...hiddenColumns, toggledColumn];
    } else {
      // Move from hidden to visible
      updatedHiddenColumns = hiddenColumns.filter(
        (columnItem) => columnItem.id !== toggledColumn.id,
      );
      updatedVisibleColumns = [...visibleColumns, toggledColumn];
    }

    setVisibleColumns(updatedVisibleColumns);
    setHiddenColumns(updatedHiddenColumns);

    const newColumnOrder = [
      "mrt-row-select",
      ...updatedVisibleColumns.map((columnItem) => columnItem.id),
      ...updatedHiddenColumns.map((columnItem) => columnItem.id),
      "mrt-row-actions",
    ];

    onSave(newColumnOrder, updatedVisibility);
  };

  if (!open) {
    return null;
  }

  return (
    <Box
      className={styles.container}
      role="dialog"
      aria-modal="true"
      aria-label="Table settings"
    >
      <MobileSettingsHeader onClose={onClose} />

      <Box className={styles.scrollContent}>
        <MobilePositionList
          visibleColumns={visibleColumns}
          onReorderColumns={handleReorderColumns}
        />

        <MobileViewList
          allColumns={availableColumns}
          columnVisibility={columnVisibility}
          onToggleColumn={handleToggleColumn}
        />
      </Box>
    </Box>
  );
};
