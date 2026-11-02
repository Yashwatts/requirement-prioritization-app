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
  arrow = false,
  classes,
  slotProps,
  ...rest
}: TooltipProps) => {
  const isInfo = variant === "info";
  const tooltipClass = isInfo ? styles.infoTooltip : styles.defaultTooltip;

  return (
    <MuiTooltip
      arrow={arrow}
      classes={{
        popper: [styles.popper, classes?.popper].filter(Boolean).join(" "),
        tooltip: [tooltipClass, classes?.tooltip].filter(Boolean).join(" "),
        ...classes,
      }}
      slotProps={slotProps}
      {...rest}
    >
      {children}
    </MuiTooltip>
  );
};
