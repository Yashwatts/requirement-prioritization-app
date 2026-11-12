"use client";

import { Box, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  ColumnConfigItem,
  ColumnListType,
} from "@/types/table-settings.types";
import styles from "./column-list-item.module.css";

export interface ColumnListItemProps {
  columnItem: ColumnConfigItem;
  listType: ColumnListType;
  isOverlay?: boolean;
  onDoubleClickItem?: (
    clickedColumnItem: ColumnConfigItem,
    targetListType: ColumnListType,
  ) => void;
}

export const ColumnListItem = ({
  columnItem,
  listType,
  isOverlay = false,
  onDoubleClickItem,
}: ColumnListItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnItem.id,
    disabled: isOverlay,
  });

  const transformStyle = isOverlay
    ? undefined
    : {
        transform: CSS.Translate.toString(transform),
        transition,
      };

  const handleItemDoubleClick = () => {
    if (onDoubleClickItem) {
      onDoubleClickItem(columnItem, listType);
    }
  };

  return (
    <Box
      ref={isOverlay ? undefined : setNodeRef}
      style={transformStyle}
      className={`${styles.listItem} ${isDragging ? styles.dragging : ""} ${
        isOverlay ? styles.overlayItem : ""
      }`.trim()}
      onDoubleClick={handleItemDoubleClick}
      {...attributes}
      {...listeners}
    >
      <Box className={styles.dragHandle}>
        <DragIndicatorIcon className={styles.dragIcon} />
      </Box>
      <Typography className={styles.itemLabel} title={columnItem.label}>
        {columnItem.label}
      </Typography>
    </Box>
  );
};
