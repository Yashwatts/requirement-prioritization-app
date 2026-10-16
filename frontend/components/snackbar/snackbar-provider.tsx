"use client";

import { Alert, AlertColor, Snackbar } from "@mui/material";
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import styles from "./snackbar-provider.module.css";

interface SnackbarContextValue {
  showSnackbar: (message: string, severity?: AlertColor) => void;
  closeSnackbar: () => void;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const AUTO_HIDE_DURATION = 4000;

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
