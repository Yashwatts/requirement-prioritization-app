"use client";

import Image from "next/image";
import appIcon from "@/assets/svg/app-icon.svg";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import { GoogleLoginButton } from "@/components/login/google-login-button/google-login-button";
import { LoginBackground } from "../login-background/login-background";
import { LanguageSelector } from "../language-selector/language-selector";
import { useLocalization } from "@/localize";
import styles from "./login-view.module.css";

export const LoginView = () => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const { translations } = useLocalization();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <Box component="main" className={styles.main}>
      <LoginBackground />

      <Box className={styles.container}>
        <Box className={styles.card}>
          <Box className={styles.leftSection}>
            <Box className={styles.iconWrapper} aria-hidden="true">
              <Image
                src={appIcon}
                alt=""
                width={50}
                height={50}
                priority
                className={styles.iconImg}
              />
            </Box>

            <Typography component="h1" className={styles.title}>
              {translations.title}
            </Typography>

            <Typography component="p" className={styles.subtext}>
              {translations.appDescription}
            </Typography>
          </Box>

          <Box className={styles.rightSection}>
            <Typography className={styles.loginText}>
              {translations.login}
            </Typography>
            <GoogleLoginButton label={translations.googleLogin} />
          </Box>
        </Box>

        <LanguageSelector />
      </Box>
    </Box>
  );
};
