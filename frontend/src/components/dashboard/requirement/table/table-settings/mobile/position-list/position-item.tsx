"use client";

import { Box, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ColumnConfigItem } from "@/types/table-settings.types";
import styles from "./position-list.module.css";

export interface MobilePositionItemProps {
  columnItem: ColumnConfigItem;
  itemIndex: number;
}

export const MobilePositionItem = ({
  columnItem,
}: MobilePositionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: columnItem.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      className={`${styles.positionItem} ${
        isDragging ? styles.positionItemDragging : ""
      }`.trim()}
    >
      <Box
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
        aria-label={`Drag ${columnItem.label}`}
      >
        <DragIndicatorIcon className={styles.dragIcon} />
      </Box>
      <Typography className={styles.itemLabel}>{columnItem.label}</Typography>
    </Box>
  );
};
