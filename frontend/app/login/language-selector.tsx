"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MouseEvent, useState } from "react";

import type { LoginLocale } from "./login-translations";
import styles from "./page.module.css";

interface LanguageSelectorProps {
  locale: LoginLocale;
  onLocaleChange: (locale: LoginLocale) => void;
  language: string;
}

export const LanguageSelector = ({
  locale,
  onLocaleChange,
  language,
}: LanguageSelectorProps) => {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorElement);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleLocaleChange = (nextLocale: LoginLocale) => {
    onLocaleChange(nextLocale);
    handleClose();
  };

  return (
    <>
      <button
        type="button"
        className={styles.translationContainer}
        id="login-language-button"
        aria-controls={isOpen ? "login-language-menu" : undefined}
        aria-expanded={isOpen ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <span>{language}</span>
        {isOpen ? (
          <ArrowDropUpIcon className={styles.arrowIcon} />
        ) : (
          <ArrowDropDownIcon className={styles.arrowIcon} />
        )}
      </button>

      <Menu
        id="login-language-menu"
        anchorEl={anchorElement}
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          paper: { className: styles.languageMenuPaper },
        }}
      >
        <MenuItem
          className={styles.languageMenuItem}
          selected={locale === "es-ES"}
          onClick={() => handleLocaleChange("es-ES")}
        >
          Español (España)
        </MenuItem>
        <MenuItem
          className={styles.languageMenuItem}
          selected={locale === "en-US"}
          onClick={() => handleLocaleChange("en-US")}
        >
          English (United States)
        </MenuItem>
      </Menu>
    </>
  );
};
