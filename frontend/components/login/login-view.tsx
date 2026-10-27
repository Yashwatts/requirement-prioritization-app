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
            <Box className={styles.iconWrapper} aria-hidden="true">
              <Box
                component="img"
                src="/login-background/figma-app-icon.svg"
                alt=""
                width={50}
                height={50}
                className={styles.iconImg}
              />
            </Box>

            <Typography
              component="h1"
              className={styles.title}
            >
              {translation.title}
            </Typography>

            <Typography
              component="p"
              className={styles.subtext}
            >
              {translation.description}
            </Typography>
          </Box>

          <Box className={styles.rightSection}>
            <Typography
              className={styles.loginText}
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
