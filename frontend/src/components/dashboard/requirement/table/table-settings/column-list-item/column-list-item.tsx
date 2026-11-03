"use client";

import type { DragEvent } from "react";
import { Box, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type {
  ColumnConfigItem,
  ColumnListType,
} from "@/types/table-settings.types";
import styles from "./column-list-item.module.css";

export interface ColumnListItemProps {
  item: ColumnConfigItem;
  index: number;
  listType: ColumnListType;
  isDragging: boolean;
  dropIndicator: "top" | "bottom" | null;
  onDragStart: (
    e: DragEvent<HTMLDivElement>,
    item: ColumnConfigItem,
    index: number,
    listType: ColumnListType,
  ) => void;
  onDragOver: (
    e: DragEvent<HTMLDivElement>,
    index: number,
    listType: ColumnListType,
  ) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (
    e: DragEvent<HTMLDivElement>,
    index: number,
    listType: ColumnListType,
  ) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  onDoubleClick: (item: ColumnConfigItem, listType: ColumnListType) => void;
}

export const ColumnListItem = ({
  item,
  index,
  listType,
  isDragging,
  dropIndicator,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onDoubleClick,
}: ColumnListItemProps) => {
  const getIndicatorClassName = () => {
    if (dropIndicator === "top") return styles.dragOverTop;
    if (dropIndicator === "bottom") return styles.dragOverBottom;
    return "";
  };

  return (
    <Box
      className={`${styles.listItem} ${
        isDragging ? styles.dragging : ""
      } ${getIndicatorClassName()}`}
      draggable
      onDragStart={(e) => onDragStart(e, item, index, listType)}
      onDragOver={(e) => onDragOver(e, index, listType)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index, listType)}
      onDragEnd={onDragEnd}
      onDoubleClick={() => onDoubleClick(item, listType)}
    >
      <Box className={styles.dragHandle}>
        <DragIndicatorIcon className={styles.dragIcon} />
      </Box>
      <Typography className={styles.itemLabel} title={item.label}>
        {item.label}
      </Typography>
    </Box>
  );
};
