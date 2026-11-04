"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useLocalization } from "@/localize";
import styles from "./link-dialog.module.css";

interface LinkDialogProps {
  open: boolean;
  editor: Editor | null;
  onClose: () => void;
}

export const LinkDialog = ({ open, editor, onClose }: LinkDialogProps) => {
  const { translate } = useLocalization();
  const [linkText, setLinkText] = useState("");
  const [url, setUrl] = useState("");
  const [savedRange, setSavedRange] = useState<{ from: number; to: number }>({
    from: 0,
    to: 0,
  });
  const [isExistingLink, setIsExistingLink] = useState(false);

  useEffect(() => {
    if (open && editor) {
      const isActive = editor.isActive("link");
      setIsExistingLink(isActive);

      if (isActive) {
        editor.chain().extendMarkRange("link").run();
      }

      const { from, to, empty } = editor.state.selection;
      setSavedRange({ from, to });

      const text = empty ? "" : editor.state.doc.textBetween(from, to, " ");
      setLinkText(text);

      const href = (editor.getAttributes("link").href as string) ?? "";
      setUrl(href);
    }
  }, [open, editor]);

  const handleSave = () => {
    if (!editor) return;
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      if (isExistingLink) {
        editor
          .chain()
          .focus()
          .setTextSelection(savedRange)
          .extendMarkRange("link")
          .unsetLink()
          .run();
      }
      if (linkText.trim()) {
        editor
          .chain()
          .focus()
          .insertContentAt(savedRange, linkText.trim())
          .run();
      }
      onClose();
      return;
    }

    const formattedUrl = /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;

    const textToDisplay = linkText.trim() || formattedUrl;
    const escapedText = textToDisplay
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    editor
      .chain()
      .focus()
      .insertContentAt(
        savedRange,
        `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer">${escapedText}</a>`,
      )
      .run();

    onClose();
  };

  const handleUnlink = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .setTextSelection(savedRange)
      .extendMarkRange("link")
      .unsetLink()
      .run();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="insert-link-dialog-title"
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
      }}
    >
      <DialogTitle id="insert-link-dialog-title" className={styles.title}>
        {translate("insertLink")}
      </DialogTitle>

      <DialogContent className={styles.content}>
        <TextField
          label={translate("linkText")}
          value={linkText}
          onChange={(event) => setLinkText(event.target.value)}
          helperText={translate("optional")}
          fullWidth
          size="small"
          autoFocus={!linkText}
          slotProps={{
            input: {
              className: styles.inputRoot,
            },
            inputLabel: {
              className: styles.inputLabel,
            },
            formHelperText: {
              className: styles.helperText,
            },
          }}
        />

        <TextField
          label={translate("url")}
          placeholder="https://example.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          fullWidth
          size="small"
          autoFocus={Boolean(linkText)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSave();
            }
          }}
          slotProps={{
            input: {
              className: styles.inputRoot,
            },
            inputLabel: {
              className: styles.inputLabel,
            },
          }}
        />
      </DialogContent>

      <DialogActions className={styles.actions}>
        {isExistingLink && (
          <Button
            type="button"
            onClick={handleUnlink}
            className={styles.unlinkButton}
          >
            {translate("unlink")}
          </Button>
        )}
        <Button type="button" onClick={onClose} className={styles.cancelButton}>
          {translate("cancel")}
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          className={styles.saveButton}
        >
          {translate("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

