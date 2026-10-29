"use client";

import Image from "next/image";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useLocalization } from "@/localize";
import requirementsIcon from "@/assets/svg/requirements-icon.svg";
import styles from "./sidebar.module.css";

interface SidebarProps {
  open: boolean;
}

export const Sidebar = ({ open }: SidebarProps) => {
  const { translate } = useLocalization();
  const requirementsLabel = translate("requirements");

  const railItems = [
    { label: "Home", type: "mui" as const, icon: HomeOutlinedIcon },
    { label: requirementsLabel, type: "image" as const, active: true },
    { label: "Grid view", type: "mui" as const, icon: GridViewOutlinedIcon },
    { label: "Analytics", type: "mui" as const, icon: BarChartOutlinedIcon },
    { label: "Settings", type: "mui" as const, icon: SettingsOutlinedIcon },
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
                  {item.type === "image" ? (
                    <Image
                      src={requirementsIcon}
                      alt={item.label}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <item.icon />
                  )}
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      )}
    </Box>
  );
};
