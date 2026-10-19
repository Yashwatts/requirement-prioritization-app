"use client";

import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
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

import styles from "./sidebar.module.css";

interface SidebarProps {
  open: boolean;
}

const items = [
  { label: "Home", icon: HomeOutlinedIcon },
  { label: "Requirements", icon: FormatListBulletedOutlinedIcon, active: true },
  { label: "Grid view", icon: GridViewOutlinedIcon },
  { label: "Analytics", icon: BarChartOutlinedIcon },
  { label: "Settings", icon: SettingsOutlinedIcon },
];

export const Sidebar = ({ open }: SidebarProps) => (
  <Box
    className={`${styles.sidebar} ${open ? styles.expanded : ""}`}
    component="aside"
  >
    {open ? (
      <List disablePadding>
        <ListItemButton className={styles.expandedItem} selected>
          <ListItemIcon className={styles.expandedIcon}>
            <FormatListBulletedOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Requirements" />
        </ListItemButton>
      </List>
    ) : (
      <List disablePadding>
        {items.map(({ label, icon: Icon, active }) => (
          <Tooltip key={label} title={label} placement="right">
            <ListItemButton className={styles.railItem} selected={active}>
              <ListItemIcon className={styles.railIcon}>
                <Icon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    )}
  </Box>
);
