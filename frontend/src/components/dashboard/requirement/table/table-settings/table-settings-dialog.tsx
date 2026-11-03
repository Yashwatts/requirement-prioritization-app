"use client";

import { useMemo, useState, type DragEvent } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import syncAltIcon from "@/assets/svg/sync-alt-icon.svg";
import { useLocalization } from "@/localize";
import type {
  ColumnConfigItem,
  ColumnListType,
  DraggedItemState,
  DragOverTargetState,
  TableSettingsDialogProps,
} from "@/types/table-settings.types";
import { ColumnListPanel } from "./column-list-panel/column-list-panel";
import styles from "./table-settings-dialog.module.css";

interface TableSettingsContentProps {
  onClose: () => void;
  availableColumns: ColumnConfigItem[];
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  onSave: (
    newColumnOrder: string[],
    newColumnVisibility: Record<string, boolean>,
  ) => void;
}

const TableSettingsContent = ({
  onClose,
  availableColumns,
  columnOrder,
  columnVisibility,
  onSave,
}: TableSettingsContentProps) => {
  const { translate } = useLocalization();

  const initialColumns = useMemo(() => {
    const visibleList: ColumnConfigItem[] = [];
    const hiddenList: ColumnConfigItem[] = [];

    availableColumns.forEach((col) => {
      const isVisible = columnVisibility[col.id] !== false;
      if (isVisible) {
        visibleList.push(col);
      } else {
        hiddenList.push(col);
      }
    });

    if (columnOrder && columnOrder.length > 0) {
      visibleList.sort((a, b) => {
        const aIndex = columnOrder.indexOf(a.id);
        const bIndex = columnOrder.indexOf(b.id);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });

      hiddenList.sort((a, b) => {
        const aIndex = columnOrder.indexOf(a.id);
        const bIndex = columnOrder.indexOf(b.id);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }

    return { visibleList, hiddenList };
  }, [availableColumns, columnOrder, columnVisibility]);

  const [visibleColumns, setVisibleColumns] = useState<ColumnConfigItem[]>(
    () => initialColumns.visibleList,
  );
  const [hiddenColumns, setHiddenColumns] = useState<ColumnConfigItem[]>(
    () => initialColumns.hiddenList,
  );

  const [draggedState, setDraggedState] = useState<DraggedItemState | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<DragOverTargetState | null>(
    null,
  );
  const [dropPosition, setDropPosition] = useState<"top" | "bottom" | null>(null);

  const moveItem = (
    sourceListType: ColumnListType,
    sourceIndex: number,
    targetListType: ColumnListType,
    targetIndex: number,
  ) => {
    if (sourceListType === targetListType) {
      const list =
        sourceListType === "visible" ? [...visibleColumns] : [...hiddenColumns];
      const [moved] = list.splice(sourceIndex, 1);
      const adjustedTarget =
        targetIndex > sourceIndex ? targetIndex - 1 : targetIndex;
      const safeIndex = Math.max(0, Math.min(adjustedTarget, list.length));
      list.splice(safeIndex, 0, moved);

      if (sourceListType === "visible") {
        setVisibleColumns(list);
      } else {
        setHiddenColumns(list);
      }
    } else {
      const source =
        sourceListType === "visible" ? [...visibleColumns] : [...hiddenColumns];
      const target =
        targetListType === "visible" ? [...visibleColumns] : [...hiddenColumns];
      const [moved] = source.splice(sourceIndex, 1);
      const safeIndex = Math.max(0, Math.min(targetIndex, target.length));
      target.splice(safeIndex, 0, moved);

      if (sourceListType === "visible") {
        setVisibleColumns(source);
        setHiddenColumns(target);
      } else {
        setHiddenColumns(source);
        setVisibleColumns(target);
      }
    }
  };

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    item: ColumnConfigItem,
    index: number,
    listType: ColumnListType,
  ) => {
    setDraggedState({ item, sourceIndex: index, sourceList: listType });
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ id: item.id, listType, index }),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverItem = (
    e: DragEvent<HTMLDivElement>,
    index: number,
    listType: ColumnListType,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    const targetRect = e.currentTarget.getBoundingClientRect();
    const isTopHalf = e.clientY - targetRect.top < targetRect.height / 2;
    setDropPosition(isTopHalf ? "top" : "bottom");
    setDragOverTarget({ listType, targetIndex: index });
  };

  const handleDragLeaveItem = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragOverContainer = (
    e: DragEvent<HTMLDivElement>,
    listType: ColumnListType,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (e.target === e.currentTarget) {
      setDragOverTarget({ listType, targetIndex: -1 });
      setDropPosition(null);
    }
  };

  const handleDropOnItem = (
    e: DragEvent<HTMLDivElement>,
    index: number,
    listType: ColumnListType,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedState) return;

    const targetIndex = dropPosition === "bottom" ? index + 1 : index;
    moveItem(
      draggedState.sourceList,
      draggedState.sourceIndex,
      listType,
      targetIndex,
    );

    setDraggedState(null);
    setDragOverTarget(null);
    setDropPosition(null);
  };

  const handleDropOnContainer = (
    e: DragEvent<HTMLDivElement>,
    listType: ColumnListType,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedState) return;

    const targetList = listType === "visible" ? visibleColumns : hiddenColumns;
    moveItem(
      draggedState.sourceList,
      draggedState.sourceIndex,
      listType,
      targetList.length,
    );

    setDraggedState(null);
    setDragOverTarget(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedState(null);
    setDragOverTarget(null);
    setDropPosition(null);
  };

  const handleDoubleClickItem = (
    item: ColumnConfigItem,
    listType: ColumnListType,
  ) => {
    if (listType === "visible") {
      const sourceIndex = visibleColumns.findIndex((c) => c.id === item.id);
      if (sourceIndex >= 0) {
        moveItem("visible", sourceIndex, "hidden", hiddenColumns.length);
      }
    } else {
      const sourceIndex = hiddenColumns.findIndex((c) => c.id === item.id);
      if (sourceIndex >= 0) {
        moveItem("hidden", sourceIndex, "visible", visibleColumns.length);
      }
    }
  };

  const handleSave = () => {
    const newColumnOrder = [
      "mrt-row-select",
      ...visibleColumns.map((col) => col.id),
      ...hiddenColumns.map((col) => col.id),
      "mrt-row-actions",
    ];

    const newColumnVisibility: Record<string, boolean> = {};
    visibleColumns.forEach((col) => {
      newColumnVisibility[col.id] = true;
    });
    hiddenColumns.forEach((col) => {
      newColumnVisibility[col.id] = false;
    });

    onSave(newColumnOrder, newColumnVisibility);
    onClose();
  };

  return (
    <>
      <DialogTitle id="table-settings-dialog-title" className={styles.title}>
        {translate("tableSettings")}
      </DialogTitle>

      <DialogContent className={styles.content}>
        <ColumnListPanel
          title={translate("visibleColumns")}
          listType="visible"
          items={visibleColumns}
          draggedState={draggedState}
          dragOverTarget={dragOverTarget}
          dropPosition={dropPosition}
          onDragStart={handleDragStart}
          onDragOverItem={handleDragOverItem}
          onDragLeaveItem={handleDragLeaveItem}
          onDropOnItem={handleDropOnItem}
          onDragOverContainer={handleDragOverContainer}
          onDropOnContainer={handleDropOnContainer}
          onDragEnd={handleDragEnd}
          onDoubleClickItem={handleDoubleClickItem}
        />

        <Box className={styles.syncIconWrapper}>
          <Image
            src={syncAltIcon}
            alt="Sync columns"
            width={20}
            height={20}
            className={styles.syncIcon}
          />
        </Box>

        <ColumnListPanel
          title={translate("hiddenColumns")}
          listType="hidden"
          items={hiddenColumns}
          draggedState={draggedState}
          dragOverTarget={dragOverTarget}
          dropPosition={dropPosition}
          onDragStart={handleDragStart}
          onDragOverItem={handleDragOverItem}
          onDragLeaveItem={handleDragLeaveItem}
          onDropOnItem={handleDropOnItem}
          onDragOverContainer={handleDragOverContainer}
          onDropOnContainer={handleDropOnContainer}
          onDragEnd={handleDragEnd}
          onDoubleClickItem={handleDoubleClickItem}
        />
      </DialogContent>

      <DialogActions className={styles.actions}>
        <Button
          type="button"
          onClick={onClose}
          className={styles.cancelButton}
        >
          {translate("cancel")}
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          className={styles.saveButton}
        >
          {translate("save")}
        </Button>
      </DialogActions>
    </>
  );
};

export const TableSettingsDialog = ({
  open,
  onClose,
  availableColumns,
  columnOrder,
  columnVisibility,
  onSave,
}: TableSettingsDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="table-settings-dialog-title"
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
      }}
    >
      {open && (
        <TableSettingsContent
          onClose={onClose}
          availableColumns={availableColumns}
          columnOrder={columnOrder}
          columnVisibility={columnVisibility}
          onSave={onSave}
        />
      )}
    </Dialog>
  );
};
