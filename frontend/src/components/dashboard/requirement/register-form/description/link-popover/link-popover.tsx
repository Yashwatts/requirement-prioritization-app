"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { Button, Popover, TextField } from "@mui/material";
import styles from "./link-popover.module.css";

interface LinkPopoverProps {
  editor: Editor | null;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export const LinkPopover = ({
  editor,
  anchorEl,
  onClose,
}: LinkPopoverProps) => {
  const [prevAnchorEl, setPrevAnchorEl] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState("");

  if (anchorEl !== prevAnchorEl) {
    setPrevAnchorEl(anchorEl);
    if (anchorEl && editor) {
      setUrl(editor.getAttributes("link").href ?? "");
    }
  }

  const handleApply = () => {
    if (!editor) return;
    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const formatted = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: formatted })
        .run();
    }
    onClose();
  };

  const handleRemove = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onClose();
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      slotProps={{
        paper: {
          className: styles.popoverPaper,
        },
      }}
    >
      <TextField
        className={styles.urlInput}
        size="small"
        placeholder="https://example.com"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleApply();
          }
        }}
      />
      <Button
        size="small"
        variant="contained"
        onClick={handleApply}
        className={styles.saveButton}
      >
        Save
      </Button>
      {editor?.isActive("link") && (
        <Button
          size="small"
          color="error"
          onClick={handleRemove}
          className={styles.unlinkButton}
        >
          Unlink
        </Button>
      )}
    </Popover>
  );
};
