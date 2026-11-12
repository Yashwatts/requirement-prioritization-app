"use client";

import { Box, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type {
  ColumnConfigItem,
  ColumnListType,
} from "@/types/table-settings.types";
import { ColumnListItem } from "../column-list-item/column-list-item";
import styles from "./column-list-panel.module.css";

export interface ColumnListPanelProps {
  panelTitle: string;
  listType: ColumnListType;
  columnItems: ColumnConfigItem[];
  onDoubleClickItem?: (
    clickedColumnItem: ColumnConfigItem,
    targetListType: ColumnListType,
  ) => void;
}

export const ColumnListPanel = ({
  panelTitle,
  listType,
  columnItems,
  onDoubleClickItem,
}: ColumnListPanelProps) => {
  const { setNodeRef, isOver: isOverContainer } = useDroppable({
    id: listType,
  });

  return (
    <Box className={styles.columnContainer}>
      <Typography className={styles.columnHeaderLabel}>{panelTitle}</Typography>
      <SortableContext
        id={listType}
        items={columnItems.map((columnItem) => columnItem.id)}
        strategy={verticalListSortingStrategy}
      >
        <Box
          ref={setNodeRef}
          className={`${styles.listBox} ${
            isOverContainer ? styles.containerDragOver : ""
          }`}
        >
          {columnItems.map((columnItem) => (
            <ColumnListItem
              key={columnItem.id}
              columnItem={columnItem}
              listType={listType}
              onDoubleClickItem={onDoubleClickItem}
            />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
};
