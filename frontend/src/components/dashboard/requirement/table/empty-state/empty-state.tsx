"use client";

import Image from "next/image";
import { Box, Typography } from "@mui/material";
import { useLocalization } from "@/localize";
import emptyStreet from "@/assets/svg/empty-street.svg";
import styles from "./empty-state.module.css";

export const EmptyState = () => {
  const { translate } = useLocalization();

  return (
    <Box className={styles.emptyState}>
      <Box className={styles.emptyStateIllustration} aria-hidden="true">
        <Image
          src={emptyStreet}
          alt=""
          width={190}
          height={147}
        />
      </Box>
      <Typography className={styles.emptyStateMessage}>
        {translate("noResultsFound")}
      </Typography>
    </Box>
  );
};
