"use client";

import type { DragEvent } from "react";
import { Box, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { ColumnConfigItem } from "@/types/table-settings.types";
import styles from "./position-list.module.css";

export interface MobilePositionItemProps {
  columnItem: ColumnConfigItem;
  itemIndex: number;
  isDragging: boolean;
  dropPosition: "top" | "bottom" | null;
  onDragStart: (
    dragEvent: DragEvent<HTMLDivElement>,
    itemIndex: number,
  ) => void;
  onDragOver: (
    dragEvent: DragEvent<HTMLDivElement>,
    itemIndex: number,
  ) => void;
  onDragLeave: (dragEvent: DragEvent<HTMLDivElement>) => void;
  onDrop: (dragEvent: DragEvent<HTMLDivElement>, itemIndex: number) => void;
  onDragEnd: (dragEvent: DragEvent<HTMLDivElement>) => void;
}

export const MobilePositionItem = ({
  columnItem,
  itemIndex,
  isDragging,
  dropPosition,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: MobilePositionItemProps) => {
  const getDropIndicatorClass = () => {
    if (dropPosition === "top") return styles.dragOverTop;
    if (dropPosition === "bottom") return styles.dragOverBottom;
    return "";
  };

  return (
    <Box
      draggable
      className={`${styles.positionItem} ${
        isDragging ? styles.positionItemDragging : ""
      } ${getDropIndicatorClass()}`.trim()}
      onDragStart={(dragEvent) => onDragStart(dragEvent, itemIndex)}
      onDragOver={(dragEvent) => onDragOver(dragEvent, itemIndex)}
      onDragLeave={onDragLeave}
      onDrop={(dragEvent) => onDrop(dragEvent, itemIndex)}
      onDragEnd={onDragEnd}
    >
      <Box className={styles.dragHandle}>
        <DragIndicatorIcon className={styles.dragIcon} />
      </Box>
      <Typography className={styles.itemLabel}>{columnItem.label}</Typography>
    </Box>
  );
};

