"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkIcon from "@mui/icons-material/Link";
import CodeIcon from "@mui/icons-material/Code";
import { LinkPopover } from "../link-popover/link-popover";
import styles from "./toolbar.module.css";

const FONT_OPTIONS = [
  {
    label: "Sans Serif",
    value: 'var(--font-open-sans), "Open Sans", sans-serif',
  },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Monospace", value: "monospace" },
];

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  const [fontAnchor, setFontAnchor] = useState<null | HTMLElement>(null);
  const [headingAnchor, setHeadingAnchor] = useState<null | HTMLElement>(null);
  const [linkAnchor, setLinkAnchor] = useState<null | HTMLElement>(null);
  const [currentFont, setCurrentFont] = useState("Sans Serif");

  if (!editor) return null;

  const isFormatActive = (format: string) => {
    const { state } = editor;
    if (state.selection.empty && state.storedMarks) {
      return state.storedMarks.some((mark) => mark.type.name === format);
    }
    return editor.isActive(format);
  };

  const handleToggleMark = (mark: "bold" | "italic" | "underline" | "code") => {
    if (!editor.view.hasFocus()) editor.view.focus();
    switch (mark) {
      case "bold":
        editor.chain().toggleBold().run();
        break;
      case "italic":
        editor.chain().toggleItalic().run();
        break;
      case "underline":
        editor.chain().toggleUnderline().run();
        break;
      case "code":
        editor.chain().toggleCode().run();
        break;
    }
  };

  const handleToggleList = (list: "orderedList" | "bulletList") => {
    if (!editor.view.hasFocus()) editor.view.focus();
    if (list === "orderedList") {
      editor.chain().toggleOrderedList().run();
    } else {
      editor.chain().toggleBulletList().run();
    }
  };

  const handleFontSelect = (label: string, fontVal: string) => {
    setCurrentFont(label);
    setFontAnchor(null);
    if (!editor.view.hasFocus()) editor.view.focus();
    editor.chain().setFontFamily(fontVal).run();
  };

  const handleHeadingSelect = (level: 0 | 1 | 2 | 3) => {
    setHeadingAnchor(null);
    if (!editor.view.hasFocus()) editor.view.focus();
    if (level === 0) {
      editor.chain().setParagraph().run();
    } else {
      editor.chain().toggleHeading({ level }).run();
    }
  };

  return (
    <>
      <Box className={styles.toolbar}>
        <Button
          disableRipple
          size="small"
          type="button"
          className={styles.fontDropdownButton}
          onClick={(event) => setFontAnchor(event.currentTarget)}
          onMouseDown={(event) => event.preventDefault()}
          aria-label="Font family"
        >
          <span className={styles.dropdownLabel}>{currentFont}</span>
          <KeyboardArrowDownIcon className={styles.chevronIcon} />
        </Button>
        <Menu
          anchorEl={fontAnchor}
          open={Boolean(fontAnchor)}
          onClose={() => setFontAnchor(null)}
        >
          {FONT_OPTIONS.map((opt) => (
            <MenuItem
              key={opt.label}
              selected={currentFont === opt.label}
              onClick={() => handleFontSelect(opt.label, opt.value)}
            >
              <Typography sx={{ fontFamily: opt.value, fontSize: "14px" }}>
                {opt.label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>

        <Box className={styles.toolbarDivider} />

        <Button
          disableRipple
          size="small"
          type="button"
          className={styles.headingDropdownButton}
          onClick={(event) => setHeadingAnchor(event.currentTarget)}
          onMouseDown={(event) => event.preventDefault()}
          aria-label="Heading selection"
        >
          <FormatSizeIcon className={styles.headingSizeIcon} />
          <ArrowDropDownIcon className={styles.headingArrowIcon} />
        </Button>
        <Menu
          anchorEl={headingAnchor}
          open={Boolean(headingAnchor)}
          onClose={() => setHeadingAnchor(null)}
        >
          <MenuItem
            selected={editor.isActive("paragraph")}
            onClick={() => handleHeadingSelect(0)}
          >
            Normal text
          </MenuItem>
          <MenuItem
            selected={editor.isActive("heading", { level: 1 })}
            onClick={() => handleHeadingSelect(1)}
          >
            <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 700 }}>
              Heading 1
            </Typography>
          </MenuItem>
          <MenuItem
            selected={editor.isActive("heading", { level: 2 })}
            onClick={() => handleHeadingSelect(2)}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontSize: "15px", fontWeight: 600 }}
            >
              Heading 2
            </Typography>
          </MenuItem>
          <MenuItem
            selected={editor.isActive("heading", { level: 3 })}
            onClick={() => handleHeadingSelect(3)}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "14px", fontWeight: 600 }}
            >
              Heading 3
            </Typography>
          </MenuItem>
        </Menu>

        <Box className={styles.toolbarDivider} />

        <Box className={styles.formatGroup}>
          <Button
            disableRipple
            size="small"
            type="button"
            className={`${styles.iconButton} ${
              isFormatActive("bold") ? styles.activeButton : ""
            }`}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleMark("bold");
            }}
            aria-label="Bold"
          >
            <FormatBoldIcon className={styles.toolbarIcon} />
          </Button>

          <Button
            disableRipple
            size="small"
            type="button"
            className={`${styles.iconButton} ${
              isFormatActive("italic") ? styles.activeButton : ""
            }`}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleMark("italic");
            }}
            aria-label="Italic"
          >
            <FormatItalicIcon className={styles.toolbarIcon} />
          </Button>

          <Button
            disableRipple
            size="small"
            type="button"
            className={`${styles.iconButton} ${
              isFormatActive("underline") ? styles.activeButton : ""
            }`}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleMark("underline");
            }}
            aria-label="Underline"
          >
            <FormatUnderlinedIcon className={styles.toolbarIcon} />
          </Button>
        </Box>

        <Box className={styles.toolbarDivider} />

        <Box className={styles.listGroup}>
          <Button
            disableRipple
            size="small"
            type="button"
            className={`${styles.iconButton} ${
              editor.isActive("orderedList") ? styles.activeButton : ""
            }`}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleList("orderedList");
            }}
            aria-label="Numbered List"
          >
            <FormatListNumberedIcon className={styles.toolbarIcon} />
          </Button>

          <Button
            disableRipple
            size="small"
            type="button"
            className={`${styles.iconButton} ${
              editor.isActive("bulletList") ? styles.activeButton : ""
            }`}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleList("bulletList");
            }}
            aria-label="Bullet List"
          >
            <FormatListBulletedIcon className={styles.toolbarIcon} />
          </Button>
        </Box>

        <Box className={styles.linkCodeGroup}>
          <Button
            disableRipple
            size="small"
            type="button"
            className={`${styles.linkCodeButton} ${
              editor.isActive("link") ? styles.activeButton : ""
            }`}
            onClick={(event) => setLinkAnchor(event.currentTarget)}
            onMouseDown={(event) => event.preventDefault()}
            aria-label="Link"
          >
            <LinkIcon className={styles.linkIcon} />
          </Button>

          <Button
            disableRipple
            size="small"
            type="button"
            className={`${styles.linkCodeButton} ${
              isFormatActive("code") ? styles.activeButton : ""
            }`}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleMark("code");
            }}
            aria-label="Code"
          >
            <CodeIcon className={styles.codeIcon} />
          </Button>
        </Box>
      </Box>

      <LinkPopover
        editor={editor}
        anchorEl={linkAnchor}
        onClose={() => setLinkAnchor(null)}
      />
    </>
  );
};
