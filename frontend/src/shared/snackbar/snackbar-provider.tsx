"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { Box, IconButton, Snackbar, Typography } from "@mui/material";
import type { AlertColor } from "@mui/material";
import type {
  SnackbarContextValue,
  SnackbarProviderProps,
  SnackbarState,
} from "@/types/snackbar.types";
import successIcon from "@/assets/svg/snackbar-success-icon.svg";
import errorIcon from "@/assets/svg/snackbar-error-icon.svg";
import warningIcon from "@/assets/svg/snackbar-warning-icon.svg";
import infoIcon from "@/assets/svg/snackbar-info-icon.svg";
import closeIcon from "@/assets/svg/snackbar-close-icon.svg";
import { useLocalization } from "@/localize";
import styles from "./snackbar-provider.module.css";

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const configuredDuration = 3000;

const ICONS: Record<AlertColor, typeof successIcon> = {
  success: successIcon,
  error: errorIcon,
  warning: warningIcon,
  info: infoIcon,
};

interface CustomSnackbarAlertProps {
  severity: AlertColor;
  message: string;
  onClose: () => void;
}

const CustomSnackbarAlert = forwardRef<HTMLDivElement, CustomSnackbarAlertProps>(
  ({ severity, message, onClose }, ref) => {
    const { translate } = useLocalization();
    const iconSrc = ICONS[severity] || infoIcon;
    const severityClass = styles[severity] || styles.info;

    return (
      <Box
        ref={ref}
        className={`${styles.snackbar} ${severityClass}`}
        role="alert"
      >
        <Box className={styles.content}>
          <Box className={styles.iconWrapper}>
            <Image
              src={iconSrc}
              alt=""
              width={16}
              height={16}
              className={styles.icon}
            />
          </Box>
          <Typography className={styles.message}>{message}</Typography>
        </Box>
        <IconButton
          size="small"
          aria-label={translate("close")}
          className={styles.closeButton}
          onClick={onClose}
        >
          <Image
            src={closeIcon}
            alt=""
            width={20}
            height={20}
            className={styles.closeIcon}
          />
        </IconButton>
      </Box>
    );
  },
);

CustomSnackbarAlert.displayName = "CustomSnackbarAlert";

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = useCallback(
    (message: string, severity: AlertColor = "info") => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    },
    [],
  );

  const closeSnackbar = useCallback(() => {
    setSnackbar((current) => ({
      ...current,
      open: false,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      showSnackbar,
      closeSnackbar,
    }),
    [showSnackbar, closeSnackbar],
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={configuredDuration}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <CustomSnackbarAlert
          severity={snackbar.severity}
          message={snackbar.message}
          onClose={closeSnackbar}
        />
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
