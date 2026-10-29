"use client";

import { Box, Button } from "@mui/material";
import { useLocalization } from "@/localize";
import styles from "./footer.module.css";

interface FooterProps {
  isSubmitting: boolean;
}

export const Footer = ({ isSubmitting }: FooterProps) => {
  const { translate } = useLocalization();

  return (
    <Box className={styles.footer}>
      <Button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {translate("create")}
      </Button>
    </Box>
  );
};
