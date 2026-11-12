"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Box, Chip, Typography } from "@mui/material";
import { OverflowChip } from "./overflow-chip";
import styles from "./chip-list.module.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface ChipListProps {
  items?: (string | number)[] | null;
  emptyFallback?: ReactNode;
  className?: string;
}

export const ChipList = ({
  items,
  emptyFallback = <Typography component="span">-</Typography>,
  className,
}: ChipListProps) => {
  const validItems = useMemo(
    () =>
      (items ?? [])
        .map((item) => (item !== null && item !== undefined ? String(item) : ""))
        .filter((item) => Boolean(item.trim())),
    [items],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLDivElement | null>(null);

  const [visibleCount, setVisibleCount] = useState<number>(() =>
    Math.min(1, validItems.length),
  );

  const calculateVisible = useCallback(() => {
    if (!containerRef.current || validItems.length <= 1) {
      setVisibleCount(validItems.length);
      return;
    }

    const inputRoot = containerRef.current.closest<HTMLElement>(
      ".MuiOutlinedInput-root, .MuiInputBase-root",
    );

    let containerWidth = containerRef.current.clientWidth;

    if (inputRoot) {
      const endAdornment = inputRoot.querySelector<HTMLElement>(
        ".MuiAutocomplete-endAdornment, .MuiSelect-icon",
      );
      const endAdornmentWidth = endAdornment ? endAdornment.offsetWidth : 48;
      // 14px left padding + right adornment + 12px margin + 60px reserved for typing
      containerWidth = Math.max(
        0,
        inputRoot.clientWidth - 14 - endAdornmentWidth - 12 - 60,
      );
    }

    if (containerWidth <= 0) return;

    const gapBetweenChips = 6;
    const totalItemsCount = validItems.length;

    const chipWidths = validItems.map(
      (_, index) => chipRefs.current[index]?.offsetWidth ?? 0,
    );
    const counterChipWidth = counterRef.current?.offsetWidth ?? 32;

    if (chipWidths.some((chipWidth) => chipWidth === 0)) {
      return;
    }

    // Check if all chips fit together without a counter chip
    const totalWidthForAllChips =
      chipWidths.reduce(
        (accumulatedWidth, currentChipWidth) =>
          accumulatedWidth + currentChipWidth,
        0,
      ) +
      (totalItemsCount - 1) * gapBetweenChips;

    if (totalWidthForAllChips <= containerWidth) {
      setVisibleCount(totalItemsCount);
      return;
    }

    // Find the largest number of full chips that fit alongside the +n counter chip
    let maxFittingChipCount = 1;
    let accumulatedChipsWidth = 0;

    for (
      let candidateCount = 1;
      candidateCount < totalItemsCount;
      candidateCount++
    ) {
      accumulatedChipsWidth += chipWidths[candidateCount - 1];
      const totalWidthWithCounter =
        accumulatedChipsWidth +
        candidateCount * gapBetweenChips +
        counterChipWidth;

      if (totalWidthWithCounter <= containerWidth) {
        maxFittingChipCount = candidateCount;
      } else {
        break;
      }
    }

    setVisibleCount(maxFittingChipCount);
  }, [validItems]);

  useIsomorphicLayoutEffect(() => {
    if (validItems.length <= 1) {
      setVisibleCount(validItems.length);
      return;
    }

    calculateVisible();
    const animationFrameId = requestAnimationFrame(calculateVisible);

    if (!containerRef.current) {
      return () => cancelAnimationFrame(animationFrameId);
    }

    const targetToObserve =
      containerRef.current.closest<HTMLElement>(
        ".MuiOutlinedInput-root, .MuiInputBase-root",
      ) ?? containerRef.current;

    const observer = new ResizeObserver(() => {
      calculateVisible();
    });

    observer.observe(targetToObserve);
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [validItems, calculateVisible]);

  if (validItems.length === 0) {
    return <>{emptyFallback}</>;
  }

  const visibleItems = validItems.slice(0, visibleCount);
  const hiddenItems = validItems.slice(visibleCount);
  const hasHidden = hiddenItems.length > 0;

  return (
    <>
      <Box
        ref={containerRef}
        className={`${styles.multiChipCell} ${className ?? ""}`.trim()}
      >
        {visibleItems.map((item, index) => (
          <Chip
            key={index}
            className={
              !hasHidden && visibleItems.length === 1
                ? styles.primaryChipSingle
                : styles.primaryChip
            }
            label={item}
          />
        ))}
        {hasHidden && <OverflowChip hiddenItems={hiddenItems} />}
      </Box>

      {validItems.length > 1 && (
        <Box className={styles.measureContainer} aria-hidden="true">
          {validItems.map((item, index) => (
            <Chip
              key={index}
              ref={(element) => {
                chipRefs.current[index] = element as HTMLDivElement | null;
              }}
              className={styles.measureChip}
              label={item}
            />
          ))}
          <Chip
            ref={counterRef}
            className={styles.counterChip}
            label={`+${validItems.length}`}
          />
        </Box>
      )}
    </>
  );
};
