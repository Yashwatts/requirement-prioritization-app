import { AlertColor } from "@mui/material";
import { ReactNode } from "react";

export interface SnackbarContextValue {
  showSnackbar: (message: string, severity?: AlertColor) => void;
  closeSnackbar: () => void;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export interface SnackbarProviderProps {
  children: ReactNode;
}