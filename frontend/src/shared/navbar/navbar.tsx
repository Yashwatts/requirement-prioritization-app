"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { AppUser } from "@/features/auth/auth.type";
import { authService } from "@/features/auth/auth.service";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import menuIcon from "@/assets/svg/menu-icon.svg";
import accountCircleIcon from "@/assets/svg/account-circle-icon.svg";
import logoutIcon from "@/assets/svg/logout-icon.svg";
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
import { Tooltip } from "@/shared/tooltip/tooltip";
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
  const rightContentRef = useRef<HTMLDivElement>(null);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const displayName = user?.displayName ?? user?.email ?? "User";
  const isMenuOpen = Boolean(anchorElement);

  const handleProfileClick = () => {
    if (isMenuOpen) {
      setAnchorElement(null);
    } else {
      setAnchorElement(rightContentRef.current);
    }
  };

  const logout = async () => {
    setAnchorElement(null);
    await authService.signOut();
    showSnackbar(translate("signedOutSuccessfully"), "success");
    router.replace("/login");
  };

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar className={styles.toolbar} disableGutters>
        <Box className={styles.leftContent}>
          <IconButton
            edge="start"
            aria-label="Toggle navigation menu"
            className={styles.menuButton}
            onClick={onMenuClick}
          >
            <Image
              src={menuIcon}
              alt="Toggle navigation menu"
              width={24}
              height={24}
              priority
            />
          </IconButton>
          <Typography className={styles.title}>
            {translate("title")}
          </Typography>
        </Box>
        <Box
          ref={rightContentRef}
          className={styles.rightContent}
          onClick={handleProfileClick}
        >
          <IconButton
            className={styles.profileButton}
            aria-label="User account"
            onClick={(event) => {
              event.stopPropagation();
              handleProfileClick();
            }}
          >
            <Image
              src={accountCircleIcon}
              alt="User account"
              width={20}
              height={20}
              priority
            />
          </IconButton>
          <Tooltip
            title={displayName}
            placement="bottom"
            arrow={false}
            slotProps={{
              tooltip: { className: styles.emailTooltip },
            }}
          >
            <Typography className={styles.profileName}>{displayName}</Typography>
          </Tooltip>
          <IconButton
            className={styles.arrowButton}
            aria-label={isMenuOpen ? "Close profile options" : "Open profile options"}
            onClick={(event) => {
              event.stopPropagation();
              handleProfileClick();
            }}
          >
            <KeyboardArrowDownIcon
              className={`${styles.arrowIcon} ${isMenuOpen ? styles.arrowIconOpen : ""}`}
            />
          </IconButton>
        </Box>
      </Toolbar>
      <Menu
        anchorEl={anchorElement}
        open={isMenuOpen}
        onClose={() => setAnchorElement(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        autoFocus={false}
        disableAutoFocusItem
        disableRestoreFocus
        slotProps={{
          paper: {
            className: styles.profileMenu,
            elevation: 0,
          },
          list: {
            className: styles.menuList,
          },
        }}
      >
        <Box className={styles.profileDetails}>
          <Tooltip
            title={displayName}
            placement="bottom-start"
            arrow={false}
            slotProps={{
              tooltip: { className: styles.emailTooltip },
            }}
          >
            <Typography className={styles.profileDetailsName}>
              {displayName}
            </Typography>
          </Tooltip>
          <Tooltip
            title={user?.email ?? ""}
            placement="bottom-start"
            arrow={false}
            slotProps={{
              tooltip: { className: styles.emailTooltip },
            }}
          >
            <Typography className={styles.profileDetailsEmail}>
              {user?.email}
            </Typography>
          </Tooltip>
        </Box>
        <Divider className={styles.menuDivider} />
        <Box className={styles.logoutSection}>
          <MenuItem className={styles.logoutItem} onClick={logout} disableRipple>
            <Image
              src={logoutIcon}
              alt={translate("logout")}
              width={20}
              height={20}
              className={styles.logoutIcon}
            />
            <Typography className={styles.logoutText}>
              {translate("logout")}
            </Typography>
          </MenuItem>
        </Box>
      </Menu>
    </AppBar>
  );
};
