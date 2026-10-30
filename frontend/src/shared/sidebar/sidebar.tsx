"use client";

import Image from "next/image";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Tooltip } from "@/shared/tooltip/tooltip";
import { useLocalization } from "@/localize";
import homeIcon from "@/assets/svg/home-icon.svg";
import requirementsIcon from "@/assets/svg/requirements-icon.svg";
import crosswordIcon from "@/assets/svg/crossword-icon.svg";
import analyticsIcon from "@/assets/svg/analytics-icon.svg";
import settingsIcon from "@/assets/svg/settings-icon.svg";
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

  return (
    <Box
      className={`${styles.sidebar} ${open ? styles.expanded : ""}`}
      component="aside"
    >
      {open ? (
        <List disablePadding>
          <ListItemButton className={styles.expandedItem} selected>
            <ListItemIcon className={styles.expandedIcon}>
              <Image
                src={requirementsIcon}
                alt={requirementsLabel}
                width={20}
                height={20}
              />
            </ListItemIcon>
            <ListItemText primary={requirementsLabel} />
          </ListItemButton>
        </List>
      ) : (
        <List disablePadding>
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
  );
};
