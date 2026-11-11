"use client";

import { Box, Typography } from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useLocalization } from "@/localize";
import type { ColumnConfigItem } from "@/types/table-settings.types";
import { MobilePositionItem } from "./position-item";
import styles from "./position-list.module.css";

export interface MobilePositionListProps {
  visibleColumns: ColumnConfigItem[];
  onReorderColumns: (sourceIndex: number, targetIndex: number) => void;
}

export const MobilePositionList = ({
  visibleColumns,
  onReorderColumns,
}: MobilePositionListProps) => {
  const { translate } = useLocalization();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const sourceIndex = visibleColumns.findIndex(
        (columnItem) => columnItem.id === active.id,
      );
      const targetIndex = visibleColumns.findIndex(
        (columnItem) => columnItem.id === over.id,
      );

      if (sourceIndex !== -1 && targetIndex !== -1) {
        onReorderColumns(sourceIndex, targetIndex);
      }
    }
  };

  return (
    <Box className={styles.positionSection}>
      <Typography className={styles.sectionTitle}>
        {translate("position") || "Position"}
      </Typography>

      <DndContext
        sensors={sensors}
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
