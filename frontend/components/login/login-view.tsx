"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";

import { useAuth } from "@/auth/auth-provider";
import { GoogleLoginButton } from "@/components/google-login-button/google-login-button";
import { NetworkBackground } from "@/components/network-background/network-background";
import { LanguageSelector } from "@/app/login/language-selector";
import {
  loginTranslations,
  type LoginLocale,
} from "@/app/login/login-translations";
import styles from "@/app/login/page.module.css";

export const LoginView = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [locale, setLocale] = useState<LoginLocale>("en-US");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("login-locale");
    if (savedLocale === "en-US" || savedLocale === "es-ES") {
      startTransition(() => {
        setLocale(savedLocale);
      });
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (user) {
    return null;
  }

  const translation = loginTranslations[locale];

  const handleLocaleChange = (nextLocale: LoginLocale) => {
    setLocale(nextLocale);
    window.localStorage.setItem("login-locale", nextLocale);
  };

  return (
    <Box component="main" className={styles.main}>
      <NetworkBackground />

      <Box className={styles.container}>
        <Box className={styles.card}>
          <Box className={styles.leftSection}>
            <Box className={styles.iconHeader}>
              <Box className={styles.iconWrapper} aria-hidden="true">
                <Box className={styles.iconSvg} />
              </Box>
            </Box>

            <Typography
              component="h1"
              className={styles.title}
              sx={{
                width: "352px",
                color: "#212121 !important",
                fontFamily: '"Open Sans", sans-serif !important',
                fontSize: "22px !important",
                fontWeight: "400 !important",
                lineHeight: "32px !important",
                margin: "0 !important",
              }}
            >
              {translation.title}
            </Typography>

            <Typography
              component="p"
              className={styles.subtext}
              sx={{
                width: "352px",
                color: "#757575 !important",
                fontFamily: '"Open Sans", sans-serif !important',
                fontSize: "12px !important",
                fontWeight: "400 !important",
                lineHeight: "20px !important",
                margin: "4px 0 0 0 !important",
              }}
            >
              {translation.description}
            </Typography>
          </Box>

          <Box className={styles.rightSection}>
            <Typography
              className={styles.loginText}
              sx={{
                width: "300px",
                color: "#212121 !important",
                fontFamily: '"Open Sans", sans-serif !important',
                fontSize: "18px !important",
                fontWeight: "400 !important",
                lineHeight: "24px !important",
                textAlign: "left !important",
              }}
            >
              {translation.login}
            </Typography>
            <GoogleLoginButton label={translation.googleLogin} />
          </Box>
        </Box>

        <LanguageSelector
          locale={locale}
          onLocaleChange={handleLocaleChange}
          language={translation.language}
        />
      </Box>
    </Box>
  );
};
