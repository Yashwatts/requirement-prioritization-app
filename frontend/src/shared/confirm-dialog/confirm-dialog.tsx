"use client";

import type { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useLocalization } from "@/localize";
import styles from "./confirm-dialog.module.css";

export interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  children,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  const { translate } = useLocalization();

  const resolvedCancel = cancelLabel ?? translate("cancel");
  const resolvedConfirm = confirmLabel ?? translate("discard");

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
      }}
    >
      <DialogTitle id="confirm-dialog-title" className={styles.title}>
        {title}
      </DialogTitle>
      <DialogContent className={styles.content}>
        {description && (
          <Typography id="confirm-dialog-description" className={styles.text}>
            {description}
          </Typography>
        )}
        {children}
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button type="button" onClick={onCancel} className={styles.cancelBtn}>
          {resolvedCancel}
        </Button>
        <Button type="button" onClick={onConfirm} className={styles.confirmBtn}>
          {resolvedConfirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
