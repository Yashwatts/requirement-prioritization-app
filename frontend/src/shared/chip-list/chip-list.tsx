"use client";

import { useMemo, type ReactNode } from "react";
import { Box, Chip } from "@mui/material";
import { Tooltip } from "@/shared/tooltip/tooltip";
import styles from "./chip-list.module.css";

export interface ChipListProps {
  items?: (string | number)[] | null;
  emptyFallback?: ReactNode;
  className?: string;
}

export const ChipList = ({
  items,
  emptyFallback = <span>-</span>,
  className,
}: ChipListProps) => {
  const validItems = useMemo(
    () =>
      (items ?? [])
        .map((item) => (item !== null && item !== undefined ? String(item) : ""))
        .filter((item) => Boolean(item.trim())),
    [items],
  );

  if (validItems.length === 0) {
    return <>{emptyFallback}</>;
  }

  const firstItem = validItems[0];
  const extraCount = validItems.length - 1;

  return (
    <Tooltip
      variant="light"
      placement="bottom-start"
      title={
        <Box className={styles.chipsTooltipContainer}>
          {validItems.map((item, idx) => (
            <Chip key={idx} className={styles.tooltipChip} label={item} />
          ))}
        </Box>
      }
    >
      <Box className={`${styles.multiChipCell} ${className ?? ""}`.trim()}>
        <Chip
          className={
            extraCount > 0 ? styles.primaryChip : styles.primaryChipSingle
          }
          label={firstItem}
        />
        {extraCount > 0 && (
          <Chip className={styles.counterChip} label={`+${extraCount}`} />
        )}
      </Box>
    </Tooltip>
  );
};
