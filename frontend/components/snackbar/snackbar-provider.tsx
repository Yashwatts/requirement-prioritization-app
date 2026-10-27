"use client";

import { Alert, AlertColor, Snackbar } from "@mui/material";
import { createContext, useCallback, useMemo, useState } from "react";
import styles from "./snackbar-provider.module.css";
import {
  SnackbarContextValue,
  SnackbarProviderProps,
  SnackbarState,
} from "@/@types/snackbar.types";

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const configuredDuration = Number(
  process.env.NEXT_PUBLIC_SNACKBAR_HIDE_DURATION,
);
const AUTO_HIDE_DURATION =
  Number.isFinite(configuredDuration) && configuredDuration > 0
    ? configuredDuration
    : 4000;

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
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={closeSnackbar}
          className={styles.alert}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
