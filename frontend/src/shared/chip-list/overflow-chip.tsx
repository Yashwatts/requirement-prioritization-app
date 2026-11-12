"use client";

import {
  useState,
  type MouseEvent,
  type PointerEvent,
  type TouchEvent,
} from "react";
import { Chip, Popover, Typography, useMediaQuery } from "@mui/material";
import { Tooltip } from "@/shared/tooltip/tooltip";
import styles from "./chip-list.module.css";

export interface OverflowChipProps {
  hiddenItems: string[];
}

export const OverflowChip = ({ hiddenItems }: OverflowChipProps) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const handleCounterClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setPopoverAnchor((previous) => (previous ? null : event.currentTarget));
  };

  const handlePointerDown = (event: PointerEvent) => {
    event.stopPropagation();
  };

  const handleMouseDown = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const handleTouchStart = (event: TouchEvent) => {
    event.stopPropagation();
  };

  if (!isMobile) {
    return (
      <Tooltip placement="bottom-start" title={hiddenItems.join(", ")}>
        <Chip
          className={styles.counterChip}
          label={`+${hiddenItems.length}`}
        />
      </Tooltip>
    );
  }

  return (
    <>
      <Chip
        className={styles.counterChip}
        label={`+${hiddenItems.length}`}
        onClick={handleCounterClick}
        onPointerDown={handlePointerDown}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            className: styles.popoverPaper,
          },
        }}
        disableRestoreFocus
      >
        <Typography className={styles.popoverText}>
          {hiddenItems.join(", ")}
        </Typography>
      </Popover>
    </>
  );
};

