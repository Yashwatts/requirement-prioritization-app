"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, CircularProgress, Typography } from "@mui/material";
import googleIcon from "@/assets/svg/google-icon.svg";
import { useSnackbar } from "@/shared/snackbar/use-snackbar";
import { useLocalization } from "@/localize";
import { authService } from "@/features/auth/auth.service";
import {
  getFirebaseAuthErrorMessage,
  isFirebaseAuthCancellation,
} from "@/features/auth/firebase-error";
import styles from "./google-login-button.module.css";

export interface GoogleLoginButtonProps {
  label?: string;
}

export const GoogleLoginButton = ({
  label = "Continue with Google",
}: GoogleLoginButtonProps) => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { translate } = useLocalization();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      await authService.signInWithGoogle();
      showSnackbar(translate("signedInSuccessfully"), "success");
      router.replace("/dashboard");
    } catch (error) {
      const message = getFirebaseAuthErrorMessage(error);
      const isCancellation = isFirebaseAuthCancellation(error);
      showSnackbar(message, isCancellation ? "info" : "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      disabled={loading}
      onClick={handleLogin}
      className={styles.button}
    >
      {loading ? (
        <CircularProgress size={18} className={styles.loader} />
      ) : (
        <>
          <Image
            src={googleIcon}
            alt=""
            width={18}
            height={18}
            className={styles.icon}
          />
          <Typography className={styles.text}>{label}</Typography>
        </>
      )}
    </Button>
  );
};
