"use client";

import { Box, Typography } from "@mui/material";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useLocalization } from "@/localize";
import type { ColumnConfigItem } from "@/types/table-settings.types";
import { useTableSettingsDragAndDropSensors } from "@/hooks/use-table-settings-drag-and-drop";
import { MobilePositionItem } from "./position-item";
import styles from "./position-list.module.css";

export interface MobilePositionListProps {
  visibleColumns: ColumnConfigItem[];
  onReorderColumns: (
    sourceColumnIndex: number,
    targetColumnIndex: number,
  ) => void;
}

export const MobilePositionList = ({
  visibleColumns,
  onReorderColumns,
}: MobilePositionListProps) => {
  const { translate } = useLocalization();
  const dragAndDropSensors = useTableSettingsDragAndDropSensors();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const sourceColumnIndex = visibleColumns.findIndex(
        (columnItem) => columnItem.id === active.id,
      );
      const targetColumnIndex = visibleColumns.findIndex(
        (columnItem) => columnItem.id === over.id,
      );

      if (sourceColumnIndex !== -1 && targetColumnIndex !== -1) {
        onReorderColumns(sourceColumnIndex, targetColumnIndex);
      }
    }
  };

  return (
    <Box className={styles.positionSection}>
      <Typography className={styles.sectionTitle}>
        {translate("position") || "Position"}
      </Typography>

      <DndContext
        sensors={dragAndDropSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleColumns.map((columnItem) => columnItem.id)}
          strategy={verticalListSortingStrategy}
        >
          <Box className={styles.listContainer}>
            {visibleColumns.map((columnItem, index) => (
              <MobilePositionItem
                key={columnItem.id}
                columnItem={columnItem}
                itemIndex={index}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>
    </Box>
  );
};
