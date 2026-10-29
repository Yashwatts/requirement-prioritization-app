"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import styles from "./discard-dialog.module.css";

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
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
      }}
    >
      <DialogTitle id="discard-dialog-title" className={styles.title}>
        Discard form?
      </DialogTitle>
      <DialogContent className={styles.content}>
        <Typography id="discard-dialog-description" className={styles.text}>
          You have unsaved changes in this form. If you leave now, all
          modifications will be lost. Are you sure you want to discard your
          changes?
        </Typography>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} className={styles.confirmBtn}>
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
};
