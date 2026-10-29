"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Box, FormHelperText, Typography } from "@mui/material";
import type { RequirementFormValues } from "@/schemas/requirement.schema";
import { useLocalization } from "@/localize";
import { Toolbar } from "./toolbar/toolbar";
import styles from "./description.module.css";

interface TipTapCanvasProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

const TipTapCanvas = ({
  value,
  onChange,
  error,
  helperText,
}: TipTapCanvasProps) => {
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
      onChange(currentEditor.isEmpty ? "" : currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const forceUpdate = () => setTick((prev) => prev + 1);
    editor.on("transaction", forceUpdate);
    editor.on("selectionUpdate", forceUpdate);
    return () => {
      editor.off("transaction", forceUpdate);
      editor.off("selectionUpdate", forceUpdate);
    };
  }, [editor]);

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

  if (!editor) return null;

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
        <Toolbar editor={editor} />
      </Box>

      {error && helperText && (
        <FormHelperText
          className={`${styles.helperText} ${styles.helperTextError}`}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export const Description = () => {
  const { translate } = useLocalization();
  const {
    control,
    formState: { errors },
  } = useFormContext<RequirementFormValues>();

  return (
    <Box className={styles.container}>
      <Typography className={styles.sectionTitle}>
        {translate("description")}
      </Typography>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TipTapCanvas
            value={field.value}
            onChange={field.onChange}
            error={Boolean(errors.description)}
            helperText={
              errors.description
                ? errors.description.message === "required"
                  ? translate("required")
                  : errors.description.message
                : undefined
            }
          />
        )}
      />
    </Box>
  );
};
