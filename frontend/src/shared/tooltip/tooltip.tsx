"use client";

import type { ReactElement } from "react";
import {
  Tooltip as MuiTooltip,
  type TooltipProps as MuiTooltipProps,
} from "@mui/material";
import styles from "./tooltip.module.css";

export type TooltipVariant = "default" | "light" | "rich" | "info";

export interface TooltipProps extends Omit<MuiTooltipProps, "children"> {
  children: ReactElement;
  variant?: TooltipVariant;
}

export const Tooltip = ({
  children,
  variant = "default",
  arrow,
  classes,
  slotProps,
  ...rest
}: TooltipProps) => {
  if (variant === "default") {
    return (
      <MuiTooltip
        arrow={arrow}
        classes={classes}
        slotProps={slotProps}
        {...rest}
      >
        {children}
      </MuiTooltip>
    );
  }

  const tooltipClass =
    variant === "rich"
      ? styles.richTooltip
      : variant === "info"
        ? styles.infoTooltip
        : styles.lightTooltip;

  const resolvedArrow = arrow !== undefined ? arrow : variant !== "info";

  return (
    <MuiTooltip
      arrow={resolvedArrow}
      classes={{
        popper: [styles.popper, classes?.popper].filter(Boolean).join(" "),
        tooltip: [tooltipClass, classes?.tooltip].filter(Boolean).join(" "),
        arrow: resolvedArrow
          ? [styles.lightArrow, classes?.arrow].filter(Boolean).join(" ")
          : classes?.arrow,
        ...classes,
      }}
      slotProps={slotProps}
      {...rest}
    >
      {children}
    </MuiTooltip>
  );
};
