"use client";

import Image from "next/image";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Tooltip } from "@/shared/tooltip/tooltip";
import { useLocalization } from "@/localize";
import homeIcon from "@/assets/svg/home-icon.svg";
import requirementsIcon from "@/assets/svg/requirements-icon.svg";
import crosswordIcon from "@/assets/svg/crossword-icon.svg";
import analyticsIcon from "@/assets/svg/analytics-icon.svg";
import settingsIcon from "@/assets/svg/settings-icon.svg";
import appIcon from "@/assets/svg/app-icon.svg";
import styles from "./sidebar.module.css";

interface SidebarProps {
  open: boolean;
}

export const Sidebar = ({ open }: SidebarProps) => {
  const { translate } = useLocalization();
  const requirementsLabel = translate("requirements");

  const railItems = [
    { label: translate("home"), icon: homeIcon },
    { label: requirementsLabel, icon: requirementsIcon, active: true },
    { label: translate("gridView"), icon: crosswordIcon },
    { label: translate("analytics"), icon: analyticsIcon },
    { label: translate("settings"), icon: settingsIcon },
  ];

  const handleBackdropClick = () => {
    const menuButton = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Toggle navigation menu"]'
    );
    menuButton?.click();
  };

  return (
    <>
      {open && (
        <Box
          className={styles.backdrop}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
      <Box
        className={`${styles.sidebar} ${open ? styles.expanded : ""}`}
        component="aside"
      >
        <Box className={styles.mobileHeader}>
          <Box className={styles.mobileHeaderContent}>
            <Box className={styles.mobileLogoContainer}>
              <Image
                src={appIcon}
                alt="Requirements prioritization"
                width={24}
                height={24}
                priority
              />
            </Box>
            <Typography className={styles.mobileTitle}>
              {translate("title")}
            </Typography>
          </Box>
          <Box className={styles.mobileHeaderSpace} />
        </Box>
        {open ? (
          <List disablePadding className={styles.navList}>
            <ListItemButton className={styles.expandedItem} selected>
              <ListItemIcon className={styles.expandedIcon}>
                <Image
                  src={requirementsIcon}
                  alt={requirementsLabel}
                  width={20}
                  height={20}
                />
              </ListItemIcon>
              <ListItemText
                primary={requirementsLabel}
                classes={{ primary: styles.expandedItemText }}
              />
            </ListItemButton>
          </List>
        ) : (
          <List disablePadding className={styles.railList}>
            {railItems.map((item) => (
              <Tooltip key={item.label} title={item.label} placement="right">
                <ListItemButton className={styles.railItem} selected={item.active}>
                  <ListItemIcon className={styles.railIcon}>
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                    />
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        )}
      </Box>
    </>
  );
};
