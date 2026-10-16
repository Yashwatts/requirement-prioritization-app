"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import { useSnackbar } from "@/components/snackbar/use-snackbar";
import { authenticationService } from "@/auth/authentication-service";
import styles from "./logout-button.module.css";

export const LogoutButton = () => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      await authenticationService.signOut();
      showSnackbar("Signed out successfully.", "success");
      router.replace("/login");
      router.refresh();
    } catch {
      showSnackbar("Failed to sign out. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleLogout}
      className={styles.button}
    >
      {loading ? (
        <CircularProgress size={16} className={styles.loader} />
      ) : (
        <>
          <LogoutIcon className={styles.icon} />
          <span>Sign Out</span>
        </>
      )}
    </button>
  );
};
