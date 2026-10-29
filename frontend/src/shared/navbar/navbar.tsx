"use client";

import { useState } from "react";
import type { AppUser } from "@/features/auth/auth.type";
import { authService } from "@/features/auth/auth.service";
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
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/shared/snackbar/use-snackbar";
import { useLocalization } from "@/localize";
import styles from "./navbar.module.css";

export interface NavbarProps {
  user: AppUser | null;
  onMenuClick: () => void;
}

export const Navbar = ({ user, onMenuClick }: NavbarProps) => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { translate } = useLocalization();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const displayName = user?.displayName ?? user?.email ?? "User";

  const logout = async () => {
    setAnchorElement(null);
    await authService.signOut();
    showSnackbar("Signed out successfully.", "success");
    router.replace("/login");
  };

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <Box className={styles.leftContent}>
          <IconButton
            edge="start"
            aria-label="Toggle navigation menu"
            className={styles.menuButton}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={styles.title}>
            {translate("title")}
          </Typography>
        </Box>
        <Box className={styles.rightContent}>
          <IconButton
            className={styles.profileButton}
            aria-label="User account"
            onClick={(event) => setAnchorElement(event.currentTarget)}
          >
            <AccountCircleIcon />
          </IconButton>
          <Typography className={styles.profileName}>{displayName}</Typography>
          <IconButton
            className={styles.arrowButton}
            aria-label="Open profile options"
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
      >
        <MenuItem disabled>
          <Typography variant="body2">{user?.email}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Sign out
        </MenuItem>
      </Menu>
    </AppBar>
  );
};
