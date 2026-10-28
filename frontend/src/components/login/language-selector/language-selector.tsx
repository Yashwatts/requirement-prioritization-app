"use client";

import { MouseEvent, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Box, Menu, MenuItem } from "@mui/material";
import { useLocalization, type Locale } from "@/localize";
import styles from "./language-selector.module.css";

interface LanguageSelectorProps {
  locale?: Locale;
  onLocaleChange?: (nextLocale: Locale) => void;
  language?: string;
}

export const LanguageSelector = ({
  locale: propLocale,
  onLocaleChange,
  language: propLanguage,
}: LanguageSelectorProps) => {
  const { locale: contextLocale, setLocale, translations } = useLocalization();
  const currentLocale = propLocale ?? contextLocale;
  const currentLanguage = propLanguage ?? translations.language;

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorElement);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleSelect = (selectedLocale: Locale) => {
    if (onLocaleChange) {
      onLocaleChange(selectedLocale);
    } else {
      setLocale(selectedLocale);
    }
    handleClose();
  };

  return (
    <>
      <Box
        component="button"
        type="button"
        className={styles.translationContainer}
        id="login-language-button"
        aria-controls={isOpen ? "login-language-menu" : undefined}
        aria-expanded={isOpen ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <Box component="span">{currentLanguage}</Box>
        {isOpen ? (
          <ArrowDropUpIcon className={styles.arrowIcon} />
        ) : (
          <ArrowDropDownIcon className={styles.arrowIcon} />
        )}
      </Box>

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
          selected={currentLocale === "es-ES"}
          onClick={() => handleSelect("es-ES")}
        >
          Español (España)
        </MenuItem>
        <MenuItem
          className={styles.languageMenuItem}
          selected={currentLocale === "en-US"}
          onClick={() => handleSelect("en-US")}
        >
          English (United States)
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSelector;
