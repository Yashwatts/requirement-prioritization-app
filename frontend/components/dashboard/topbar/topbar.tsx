"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { authenticationService } from "@/auth/authentication-service";
import { useSnackbar } from "@/components/snackbar/use-snackbar";
import styles from "./topbar.module.css";

interface TopbarProps {
  user: User | null;
  onMenuClick: () => void;
}

export const Topbar = ({ user, onMenuClick }: TopbarProps) => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const displayName = user?.displayName || user?.email || "User";

  const logout = async () => {
    setAnchorElement(null);
    await authenticationService.signOut();
    showSnackbar("Signed out successfully.", "success");
    router.replace("/login");
  };

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <Box className={styles.leftContent}>
          <Tooltip title="Open navigation">
            <IconButton className={styles.menuButton} onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography className={styles.title}>
            Requirements prioritization
          </Typography>
        </Box>
        <Box className={styles.rightContent}>
          <IconButton
            className={styles.profileButton}
            onClick={(event) => setAnchorElement(event.currentTarget)}
          >
            <AccountCircleIcon />
          </IconButton>
          <Typography className={styles.profileName}>{displayName}</Typography>
          <IconButton
            className={styles.arrowButton}
            onClick={(event) => setAnchorElement(event.currentTarget)}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Menu
        anchorEl={anchorElement}
        open={Boolean(anchorElement)}
        onClose={() => setAnchorElement(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { className: styles.profileMenu } }}
      >
        <Box className={styles.profileDetails}>
          <Typography>{displayName}</Typography>
          <Tooltip title={user?.email || "No email available"} placement="left">
            <Typography className={styles.profileEmail}>
              {user?.email}
            </Typography>
          </Tooltip>
        </Box>
        <Divider />
        <MenuItem className={styles.logoutItem} onClick={() => void logout()}>
          <LogoutIcon />
          <Typography>Log out</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};
