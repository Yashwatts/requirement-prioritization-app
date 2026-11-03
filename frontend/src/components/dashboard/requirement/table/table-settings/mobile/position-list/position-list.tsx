"use client";

import { useState, type DragEvent } from "react";
import { Box, Typography } from "@mui/material";
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

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverTargetIndex, setDragOverTargetIndex] = useState<number | null>(
    null,
  );
  const [dropPosition, setDropPosition] = useState<"top" | "bottom" | null>(
    null,
  );

  const handleDragStart = (
    dragEvent: DragEvent<HTMLDivElement>,
    itemIndex: number,
  ) => {
    setDraggedIndex(itemIndex);
    dragEvent.dataTransfer.effectAllowed = "move";
    dragEvent.dataTransfer.setData("text/plain", String(itemIndex));
  };

  const handleDragOver = (
    dragEvent: DragEvent<HTMLDivElement>,
    targetItemIndex: number,
  ) => {
    dragEvent.preventDefault();
    dragEvent.dataTransfer.dropEffect = "move";

    if (draggedIndex === null || draggedIndex === targetItemIndex) {
      setDragOverTargetIndex(null);
      setDropPosition(null);
      return;
    }

    const boundingRectangle = dragEvent.currentTarget.getBoundingClientRect();
    const cursorOffsetY = dragEvent.clientY - boundingRectangle.top;
    const computedPosition =
      cursorOffsetY < boundingRectangle.height / 2 ? "top" : "bottom";

    setDragOverTargetIndex(targetItemIndex);
    setDropPosition(computedPosition);
  };

  const handleDragLeave = (dragEvent: DragEvent<HTMLDivElement>) => {
    const relatedTarget = dragEvent.relatedTarget as Node | null;
    if (
      !relatedTarget ||
      !dragEvent.currentTarget.contains(relatedTarget)
    ) {
      setDragOverTargetIndex(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (
    dragEvent: DragEvent<HTMLDivElement>,
    targetItemIndex: number,
  ) => {
    dragEvent.preventDefault();

    if (
      draggedIndex !== null &&
      draggedIndex !== targetItemIndex &&
      dropPosition !== null
    ) {
      let finalTargetIndex = targetItemIndex;
      if (dropPosition === "bottom" && draggedIndex > targetItemIndex) {
        finalTargetIndex = targetItemIndex + 1;
      } else if (dropPosition === "top" && draggedIndex < targetItemIndex) {
        finalTargetIndex = targetItemIndex - 1;
      }
      onReorderColumns(draggedIndex, finalTargetIndex);
    }

    setDraggedIndex(null);
    setDragOverTargetIndex(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverTargetIndex(null);
    setDropPosition(null);
  };

  if (visibleColumns.length === 0) {
    return null;
  }

  return (
    <Box className={styles.positionSection}>
      <Typography className={styles.sectionTitle}>
        {translate("position") || "Position"}
      </Typography>
      <Box className={styles.listContainer}>
        {visibleColumns.map((columnItem, itemIndex) => (
          <MobilePositionItem
            key={columnItem.id}
            columnItem={columnItem}
            itemIndex={itemIndex}
            isDragging={draggedIndex === itemIndex}
            dropPosition={
              dragOverTargetIndex === itemIndex ? dropPosition : null
            }
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Box>
    </Box>
  );
};

