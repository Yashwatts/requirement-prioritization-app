"use client";

import type { DragEvent } from "react";
import { Box, Typography } from "@mui/material";
import type {
  ColumnConfigItem,
  ColumnListType,
  DraggedItemState,
  DragOverTargetState,
} from "@/types/table-settings.types";
import { ColumnListItem } from "../column-list-item/column-list-item";
import styles from "./column-list-panel.module.css";

export interface ColumnListPanelProps {
  title: string;
  listType: ColumnListType;
  items: ColumnConfigItem[];
  draggedState: DraggedItemState | null;
  dragOverTarget: DragOverTargetState | null;
  dropPosition: "top" | "bottom" | null;
  onDragStart: (
    e: DragEvent<HTMLDivElement>,
    item: ColumnConfigItem,
    index: number,
    listType: ColumnListType,
  ) => void;
  onDragOverItem: (
    e: DragEvent<HTMLDivElement>,
    index: number,
    listType: ColumnListType,
  ) => void;
  onDragLeaveItem: (e: DragEvent<HTMLDivElement>) => void;
  onDropOnItem: (
    e: DragEvent<HTMLDivElement>,
    index: number,
    listType: ColumnListType,
  ) => void;
  onDragOverContainer: (
    e: DragEvent<HTMLDivElement>,
    listType: ColumnListType,
  ) => void;
  onDropOnContainer: (
    e: DragEvent<HTMLDivElement>,
    listType: ColumnListType,
  ) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  onDoubleClickItem: (item: ColumnConfigItem, listType: ColumnListType) => void;
}

export const ColumnListPanel = ({
  title,
  listType,
  items,
  draggedState,
  dragOverTarget,
  dropPosition,
  onDragStart,
  onDragOverItem,
  onDragLeaveItem,
  onDropOnItem,
  onDragOverContainer,
  onDropOnContainer,
  onDragEnd,
  onDoubleClickItem,
}: ColumnListPanelProps) => {
  const isTargetList = dragOverTarget?.listType === listType;
  const isContainerTarget = isTargetList && dragOverTarget?.targetIndex === -1;

  return (
    <Box className={styles.columnContainer}>
      <Typography className={styles.columnHeaderLabel}>{title}</Typography>
      <Box
        className={`${styles.listBox} ${
          isContainerTarget ? styles.containerDragOver : ""
        }`}
        onDragOver={(e) => onDragOverContainer(e, listType)}
        onDrop={(e) => onDropOnContainer(e, listType)}
      >
        {items.map((item, index) => {
          const isCurrentItemDragging =
            draggedState?.item.id === item.id &&
            draggedState?.sourceList === listType;

          const isCurrentItemTarget =
            isTargetList && dragOverTarget?.targetIndex === index;

          const indicator = isCurrentItemTarget ? dropPosition : null;

          return (
            <ColumnListItem
              key={item.id}
              item={item}
              index={index}
              listType={listType}
              isDragging={isCurrentItemDragging}
              dropIndicator={indicator}
              onDragStart={onDragStart}
              onDragOver={onDragOverItem}
              onDragLeave={onDragLeaveItem}
              onDrop={onDropOnItem}
              onDragEnd={onDragEnd}
              onDoubleClick={onDoubleClickItem}
            />
          );
        })}
      </Box>
    </Box>
  );
};

