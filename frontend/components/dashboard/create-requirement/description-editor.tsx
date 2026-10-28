"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkIcon from "@mui/icons-material/Link";
import CodeIcon from "@mui/icons-material/Code";
import styles from "./create-requirement-drawer.module.css";

interface DescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

const FONT_OPTIONS = [
  { label: "Sans Serif", value: 'var(--font-open-sans), "Open Sans", sans-serif' },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Monospace", value: "monospace" },
];

export function DescriptionEditor({
  value,
  onChange,
  error,
  helperText,
}: DescriptionEditorProps) {
  const [fontAnchor, setFontAnchor] = useState<null | HTMLElement>(null);
  const [headingAnchor, setHeadingAnchor] = useState<null | HTMLElement>(null);
  const [currentFont, setCurrentFont] = useState("Sans Serif");

  // Link Popover state
  const [linkAnchor, setLinkAnchor] = useState<null | HTMLElement>(null);
  const [linkUrl, setLinkUrl] = useState("");

  // Tick state to force re-render when TipTap transaction or selection changes
  const [, setTick] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        },
        underline: {},
      }),
      TextStyle,
      FontFamily,
    ],
    content: value ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      const isEmpty = currentEditor.isEmpty;
      onChange(isEmpty ? "" : html);
    },
  });

  // Re-render when active marks change
  useEffect(() => {
    if (!editor) return;
    const forceUpdate = () => setTick((previousTick) => previousTick + 1);
    editor.on("transaction", forceUpdate);
    editor.on("selectionUpdate", forceUpdate);
    return () => {
      editor.off("transaction", forceUpdate);
      editor.off("selectionUpdate", forceUpdate);
    };
  }, [editor]);

  // Sync external value resets
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentHTML = editor.getHTML();
      if (!value && !editor.isEmpty) {
        editor.commands.setContent("");
      } else if (value && value !== currentHTML && !editor.isFocused) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  // Open Link popover without any alert
  const handleOpenLinkPopover = (target: HTMLElement) => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href ?? "";
    setLinkUrl(previousUrl);
    setLinkAnchor(target);
  };

  const handleApplyLink = () => {
    if (!editor) return;
    const trimmed = linkUrl.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const formattedUrl = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: formattedUrl })
        .run();
    }
    setLinkAnchor(null);
    setLinkUrl("");
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkAnchor(null);
    setLinkUrl("");
  };

  const isFormatActive = (format: string) => {
    if (!editor) return false;
    const { state } = editor;
    if (state.selection.empty && state.storedMarks) {
      return state.storedMarks.some((mark) => mark.type.name === format);
    }
    return editor.isActive(format);
  };

  const handleToggleMark = (
    mark: "bold" | "italic" | "underline" | "code"
  ) => {
    if (!editor) return;
    if (!editor.view.hasFocus()) {
      editor.view.focus();
    }
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
    if (!editor) return;
    if (!editor.view.hasFocus()) {
      editor.view.focus();
    }
    if (list === "orderedList") {
      editor.chain().toggleOrderedList().run();
    } else {
      editor.chain().toggleBulletList().run();
    }
  };

  const handleFontSelect = (label: string, fontVal: string) => {
    setCurrentFont(label);
    setFontAnchor(null);
    if (!editor) return;
    if (!editor.view.hasFocus()) {
      editor.view.focus();
    }
    editor.chain().setFontFamily(fontVal).run();
  };

  const handleHeadingSelect = (level: 0 | 1 | 2 | 3) => {
    setHeadingAnchor(null);
    if (!editor) return;
    if (!editor.view.hasFocus()) {
      editor.view.focus();
    }
    if (level === 0) {
      editor.chain().setParagraph().run();
    } else {
      editor.chain().toggleHeading({ level }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Box>
      <Box className={`${styles.editor} ${error ? styles.editorError : ""}`}>
        <Box
          className={styles.editorBody}
          onClick={() => {
            if (editor && !editor.isFocused) {
              editor.commands.focus();
            }
          }}
        >
          <EditorContent editor={editor} />
        </Box>
        <Box className={styles.editorToolbar}>
          {/* 1. Font Family Dropdown */}
          <Button
            size="small"
            type="button"
            className={styles.toolbarDropdownButton}
            onClick={(event) => setFontAnchor(event.currentTarget)}
            onMouseDown={(event) => event.preventDefault()}
            aria-label="Font family"
          >
            <Typography sx={{ fontSize: "13px", fontWeight: 500, textTransform: "none" }}>
              {currentFont}
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: "16px", color: "#6b7280" }} />
          </Button>
          <Menu
            anchorEl={fontAnchor}
            open={Boolean(fontAnchor)}
            onClose={() => setFontAnchor(null)}
          >
            {FONT_OPTIONS.map((fontOption) => (
              <MenuItem
                key={fontOption.label}
                selected={currentFont === fontOption.label}
                onClick={() => handleFontSelect(fontOption.label, fontOption.value)}
              >
                <Typography sx={{ fontFamily: fontOption.value, fontSize: "14px" }}>
                  {fontOption.label}
                </Typography>
              </MenuItem>
            ))}
          </Menu>

          {/* 2. Text Size / Heading (TT) Dropdown */}
          <Button
            size="small"
            type="button"
            className={styles.toolbarDropdownButton}
            onClick={(event) => setHeadingAnchor(event.currentTarget)}
            onMouseDown={(event) => event.preventDefault()}
            aria-label="Text size"
          >
            <Typography sx={{ fontSize: "13px", fontWeight: 700, letterSpacing: "-0.5px" }}>
              TT
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: "16px", color: "#6b7280" }} />
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
              <Typography variant="subtitle1" sx={{ fontSize: "15px", fontWeight: 600 }}>
                Heading 2
              </Typography>
            </MenuItem>
            <MenuItem
              selected={editor.isActive("heading", { level: 3 })}
              onClick={() => handleHeadingSelect(3)}
            >
              <Typography variant="subtitle2" sx={{ fontSize: "14px", fontWeight: 600 }}>
                Heading 3
              </Typography>
            </MenuItem>
          </Menu>

          <Box className={styles.toolbarDivider} />

          {/* 3. Bold Button */}
          <Button
            size="small"
            type="button"
            className={isFormatActive("bold") ? styles.activeButton : ""}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleMark("bold");
            }}
            aria-label="Bold"
          >
            <Typography sx={{ fontWeight: 800, fontSize: "15px", lineHeight: 1 }}>
              B
            </Typography>
          </Button>

          {/* 4. Italic Button */}
          <Button
            size="small"
            type="button"
            className={isFormatActive("italic") ? styles.activeButton : ""}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleMark("italic");
            }}
            aria-label="Italic"
          >
            <Typography
              sx={{
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "15px",
                fontFamily: "serif",
                lineHeight: 1,
              }}
            >
              I
            </Typography>
          </Button>

          {/* 5. Underline Button */}
          <Button
            size="small"
            type="button"
            className={isFormatActive("underline") ? styles.activeButton : ""}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleMark("underline");
            }}
            aria-label="Underline"
          >
            <Typography
              sx={{
                textDecoration: "underline",
                fontWeight: 700,
                fontSize: "15px",
                lineHeight: 1,
              }}
            >
              U
            </Typography>
          </Button>

          <Box className={styles.toolbarDivider} />

          {/* 6. Numbered List */}
          <Button
            size="small"
            type="button"
            className={editor.isActive("orderedList") ? styles.activeButton : ""}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleList("orderedList");
            }}
            aria-label="Numbered List"
          >
            <FormatListNumberedIcon />
          </Button>

          {/* 7. Bullet List */}
          <Button
            size="small"
            type="button"
            className={editor.isActive("bulletList") ? styles.activeButton : ""}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleList("bulletList");
            }}
            aria-label="Bullet List"
          >
            <FormatListBulletedIcon />
          </Button>

          {/* 8. Link Button */}
          <Button
            size="small"
            type="button"
            className={editor.isActive("link") ? styles.activeButton : ""}
            onClick={(event) => handleOpenLinkPopover(event.currentTarget)}
            onMouseDown={(event) => event.preventDefault()}
            aria-label="Link"
          >
            <LinkIcon />
          </Button>

          {/* 9. Code Button */}
          <Button
            size="small"
            type="button"
            className={isFormatActive("code") ? styles.activeButton : ""}
            onMouseDown={(event) => {
              event.preventDefault();
              handleToggleMark("code");
            }}
            aria-label="Code"
          >
            <CodeIcon />
          </Button>
        </Box>
      </Box>

      {/* Modern Popover for Link URL Input (No alert/prompt) */}
      <Popover
        open={Boolean(linkAnchor)}
        anchorEl={linkAnchor}
        onClose={() => setLinkAnchor(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            sx: {
              p: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderRadius: 2,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              bgcolor: "#ffffff",
            },
          },
        }}
      >
        <TextField
          size="small"
          placeholder="https://example.com"
          value={linkUrl}
          onChange={(event) => setLinkUrl(event.target.value)}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleApplyLink();
            }
          }}
          sx={{
            width: 230,
            "& .MuiOutlinedInput-root": {
              height: 34,
              fontSize: 13,
            },
          }}
        />
        <Button
          size="small"
          variant="contained"
          onClick={handleApplyLink}
          sx={{ height: 34, minWidth: 60, textTransform: "none", fontSize: 13 }}
        >
          Save
        </Button>
        {editor.isActive("link") && (
          <Button
            size="small"
            color="error"
            onClick={handleRemoveLink}
            sx={{ height: 34, minWidth: 65, textTransform: "none", fontSize: 13 }}
          >
            Unlink
          </Button>
        )}
      </Popover>

      {error && helperText && (
        <Typography
          color="error"
          variant="caption"
          sx={{ ml: 1.5, mt: 0.5, display: "block" }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
