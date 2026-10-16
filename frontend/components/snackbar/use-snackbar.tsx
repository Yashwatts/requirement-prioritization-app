"use client";

import { useContext } from "react";

import { SnackbarContext } from "./snackbar-provider";

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used inside SnackbarProvider.");
  }

  return context;
};
