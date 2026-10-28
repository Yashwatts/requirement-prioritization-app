"use client";

import Image from "next/image";
import { Box, Typography } from "@mui/material";
import styles from "./empty-state.module.css";

export const EmptyState = () => {
  return (
    <Box className={styles.emptyState}>
      <Box className={styles.emptyStateIllustration} aria-hidden="true">
        <Image
          src="/empty-results/empty-street.svg?v=figma-1"
          alt=""
          width={190}
          height={147}
        />
      </Box>
      <Typography className={styles.emptyStateMessage}>
        No results found. Try changing your filters.
      </Typography>
    </Box>
  );
};

export const TableEmptyState = EmptyState;
