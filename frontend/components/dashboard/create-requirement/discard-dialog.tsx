"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import styles from "./create-requirement-drawer.module.css";

interface DiscardDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DiscardDialog = ({
  open,
  onCancel,
  onConfirm,
}: DiscardDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="discard-dialog-title"
      aria-describedby="discard-dialog-description"
      aria-label="By performing this action you will lose all the data entered in the form"
      slotProps={{
        paper: {
          className: styles.discardDialogPaper,
        },
      }}
    >
      <DialogTitle id="discard-dialog-title" className={styles.discardTitle}>
        Discard form?
      </DialogTitle>
      <DialogContent className={styles.discardContent}>
        <Typography
          id="discard-dialog-description"
          className={styles.discardText}
        >
          You have unsaved changes in this form. If you leave now, all
          modifications will be lost. Are you sure you want to discard your
          changes?
        </Typography>
      </DialogContent>
      <DialogActions className={styles.discardActions}>
        <Button
          type="button"
          onClick={onCancel}
          className={styles.cancelDiscardBtn}
        >
          CANCEL
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          className={styles.confirmDiscardBtn}
        >
          DISCARD
        </Button>
      </DialogActions>
    </Dialog>
  );
};
