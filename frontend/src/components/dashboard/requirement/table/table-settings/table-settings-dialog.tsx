"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import syncAltIcon from "@/assets/svg/sync-alt-icon.svg";
import { useLocalization } from "@/localize";
import type {
  ColumnConfigItem,
  ColumnListType,
  TableSettingsDialogProps,
} from "@/types/table-settings.types";
import {
  tableSettingsCollisionDetectionStrategy,
  useTableSettingsDragAndDropSensors,
} from "@/hooks/use-table-settings-drag-and-drop";
import { ColumnListPanel } from "./column-list-panel/column-list-panel";
import { ColumnListItem } from "./column-list-item/column-list-item";
import { TableSettingsDrawer } from "./mobile/table-settings-drawer";
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
  const dragAndDropSensors = useTableSettingsDragAndDropSensors();

  const initialColumns = useMemo(() => {
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
      visibleList.sort((firstColumnItem, secondColumnItem) => {
        const firstIndex = columnOrder.indexOf(firstColumnItem.id);
        const secondIndex = columnOrder.indexOf(secondColumnItem.id);
        if (firstIndex === -1 && secondIndex === -1) return 0;
        if (firstIndex === -1) return 1;
        if (secondIndex === -1) return -1;
        return firstIndex - secondIndex;
      });

      hiddenList.sort((firstColumnItem, secondColumnItem) => {
        const firstIndex = columnOrder.indexOf(firstColumnItem.id);
        const secondIndex = columnOrder.indexOf(secondColumnItem.id);
        if (firstIndex === -1 && secondIndex === -1) return 0;
        if (firstIndex === -1) return 1;
        if (secondIndex === -1) return -1;
        return firstIndex - secondIndex;
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

  const [activeColumnItem, setActiveColumnItem] =
    useState<ColumnConfigItem | null>(null);
  const [clonedVisibleColumns, setClonedVisibleColumns] = useState<
    ColumnConfigItem[] | null
  >(null);
  const [clonedHiddenColumns, setClonedHiddenColumns] = useState<
    ColumnConfigItem[] | null
  >(null);

  const findContainerForIdentifier = (
    targetIdentifier: string,
  ): ColumnListType | null => {
    if (targetIdentifier === "visible" || targetIdentifier === "hidden") {
      return targetIdentifier;
    }
    if (
      visibleColumns.some(
        (columnItem) => columnItem.id === targetIdentifier,
      )
    ) {
      return "visible";
    }
    if (
      hiddenColumns.some(
        (columnItem) => columnItem.id === targetIdentifier,
      )
    ) {
      return "hidden";
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const matchedColumnItem = [
      ...visibleColumns,
      ...hiddenColumns,
    ].find((columnItem) => columnItem.id === active.id);

    setActiveColumnItem(matchedColumnItem ?? null);
    setClonedVisibleColumns(visibleColumns);
    setClonedHiddenColumns(hiddenColumns);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIdentifier = String(active.id);
    const overIdentifier = String(over.id);

    const activeContainerType = findContainerForIdentifier(activeIdentifier);
    const overContainerType = findContainerForIdentifier(overIdentifier);

    if (
      !activeContainerType ||
      !overContainerType ||
      activeContainerType === overContainerType
    ) {
      return;
    }

    const activeColumnItems =
      activeContainerType === "visible" ? visibleColumns : hiddenColumns;
    const overColumnItems =
      overContainerType === "visible" ? visibleColumns : hiddenColumns;

    const activeColumnIndex = activeColumnItems.findIndex(
      (columnItem) => columnItem.id === activeIdentifier,
    );
    if (activeColumnIndex === -1) return;

    const [movedColumnItem] = activeColumnItems.slice(
      activeColumnIndex,
      activeColumnIndex + 1,
    );
    if (!movedColumnItem) return;

    let targetInsertionIndex = overColumnItems.length;
    if (overIdentifier !== "visible" && overIdentifier !== "hidden") {
      const overColumnIndex = overColumnItems.findIndex(
        (columnItem) => columnItem.id === overIdentifier,
      );
      if (overColumnIndex !== -1) {
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top >
            over.rect.top + over.rect.height / 2;
        targetInsertionIndex = isBelowOverItem
          ? overColumnIndex + 1
          : overColumnIndex;
      }
    }

    if (activeContainerType === "visible") {
      setVisibleColumns((currentVisibleColumns) =>
        currentVisibleColumns.filter(
          (columnItem) => columnItem.id !== activeIdentifier,
        ),
      );
      setHiddenColumns((currentHiddenColumns) => {
        const updatedHiddenColumns = [...currentHiddenColumns];
        updatedHiddenColumns.splice(targetInsertionIndex, 0, movedColumnItem);
        return updatedHiddenColumns;
      });
    } else {
      setHiddenColumns((currentHiddenColumns) =>
        currentHiddenColumns.filter(
          (columnItem) => columnItem.id !== activeIdentifier,
        ),
      );
      setVisibleColumns((currentVisibleColumns) => {
        const updatedVisibleColumns = [...currentVisibleColumns];
        updatedVisibleColumns.splice(targetInsertionIndex, 0, movedColumnItem);
        return updatedVisibleColumns;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumnItem(null);
    setClonedVisibleColumns(null);
    setClonedHiddenColumns(null);

    if (!over) return;

    const activeIdentifier = String(active.id);
    const overIdentifier = String(over.id);

    const activeContainerType = findContainerForIdentifier(activeIdentifier);
    const overContainerType = findContainerForIdentifier(overIdentifier);

    if (!activeContainerType || !overContainerType) return;

    if (activeContainerType === overContainerType) {
      const columnItems =
        activeContainerType === "visible" ? visibleColumns : hiddenColumns;
      const activeColumnIndex = columnItems.findIndex(
        (columnItem) => columnItem.id === activeIdentifier,
      );
      const overColumnIndex = columnItems.findIndex(
        (columnItem) => columnItem.id === overIdentifier,
      );

      if (
        activeColumnIndex !== -1 &&
        overColumnIndex !== -1 &&
        activeColumnIndex !== overColumnIndex
      ) {
        const reorderedColumnItems = arrayMove(
          columnItems,
          activeColumnIndex,
          overColumnIndex,
        );
        if (activeContainerType === "visible") {
          setVisibleColumns(reorderedColumnItems);
        } else {
          setHiddenColumns(reorderedColumnItems);
        }
      }
    } else {
      const activeColumnItems =
        activeContainerType === "visible" ? visibleColumns : hiddenColumns;
      const overColumnItems =
        overContainerType === "visible" ? visibleColumns : hiddenColumns;

      const activeColumnIndex = activeColumnItems.findIndex(
        (columnItem) => columnItem.id === activeIdentifier,
      );
      if (activeColumnIndex === -1) return;

      const [movedColumnItem] = activeColumnItems.slice(
        activeColumnIndex,
        activeColumnIndex + 1,
      );
      if (!movedColumnItem) return;

      const overColumnIndex =
        overIdentifier === "visible" || overIdentifier === "hidden"
          ? overColumnItems.length
          : overColumnItems.findIndex(
              (columnItem) => columnItem.id === overIdentifier,
            );

      const targetInsertionIndex =
        overColumnIndex === -1 ? overColumnItems.length : overColumnIndex;

      if (activeContainerType === "visible") {
        setVisibleColumns((currentVisibleColumns) =>
          currentVisibleColumns.filter(
            (columnItem) => columnItem.id !== activeIdentifier,
          ),
        );
        setHiddenColumns((currentHiddenColumns) => {
          const updatedHiddenColumns = [...currentHiddenColumns];
          updatedHiddenColumns.splice(targetInsertionIndex, 0, movedColumnItem);
          return updatedHiddenColumns;
        });
      } else {
        setHiddenColumns((currentHiddenColumns) =>
          currentHiddenColumns.filter(
            (columnItem) => columnItem.id !== activeIdentifier,
          ),
        );
        setVisibleColumns((currentVisibleColumns) => {
          const updatedVisibleColumns = [...currentVisibleColumns];
          updatedVisibleColumns.splice(targetInsertionIndex, 0, movedColumnItem);
          return updatedVisibleColumns;
        });
      }
    }
  };

  const handleDragCancel = () => {
    if (clonedVisibleColumns) setVisibleColumns(clonedVisibleColumns);
    if (clonedHiddenColumns) setHiddenColumns(clonedHiddenColumns);
    setActiveColumnItem(null);
    setClonedVisibleColumns(null);
    setClonedHiddenColumns(null);
  };

  const handleDoubleClickItem = (
    clickedColumnItem: ColumnConfigItem,
    targetListType: ColumnListType,
  ) => {
    if (targetListType === "visible") {
      setVisibleColumns((currentVisibleColumns) =>
        currentVisibleColumns.filter(
          (columnItem) => columnItem.id !== clickedColumnItem.id,
        ),
      );
      setHiddenColumns((currentHiddenColumns) => [
        ...currentHiddenColumns,
        clickedColumnItem,
      ]);
    } else {
      setHiddenColumns((currentHiddenColumns) =>
        currentHiddenColumns.filter(
          (columnItem) => columnItem.id !== clickedColumnItem.id,
        ),
      );
      setVisibleColumns((currentVisibleColumns) => [
        ...currentVisibleColumns,
        clickedColumnItem,
      ]);
    }
  };

  const handleSave = () => {
    const newColumnOrderList = [
      "mrt-row-select",
      ...visibleColumns.map((columnItem) => columnItem.id),
      ...hiddenColumns.map((columnItem) => columnItem.id),
      "mrt-row-actions",
    ];

    const newColumnVisibilityRecord: Record<string, boolean> = {};
    visibleColumns.forEach((columnItem) => {
      newColumnVisibilityRecord[columnItem.id] = true;
    });
    hiddenColumns.forEach((columnItem) => {
      newColumnVisibilityRecord[columnItem.id] = false;
    });

    onSave(newColumnOrderList, newColumnVisibilityRecord);
    onClose();
  };

  return (
    <>
      <DialogTitle id="table-settings-dialog-title" className={styles.title}>
        {translate("tableSettings")}
      </DialogTitle>

      <DndContext
        sensors={dragAndDropSensors}
        collisionDetection={tableSettingsCollisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <DialogContent className={styles.content}>
          <ColumnListPanel
            panelTitle={translate("visibleColumns")}
            listType="visible"
            columnItems={visibleColumns}
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
            panelTitle={translate("hiddenColumns")}
            listType="hidden"
            columnItems={hiddenColumns}
            onDoubleClickItem={handleDoubleClickItem}
          />
        </DialogContent>

        <DragOverlay>
          {activeColumnItem ? (
            <ColumnListItem
              columnItem={activeColumnItem}
              listType="visible"
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

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

export const TableSettingsDialog = (props: TableSettingsDialogProps) => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  if (isMobile) {
    return <TableSettingsDrawer {...props} />;
  }

  const {
    open,
    onClose,
    availableColumns,
    columnOrder,
    columnVisibility,
    onSave,
  } = props;

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
