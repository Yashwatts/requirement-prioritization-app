"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

import { useAuth } from "@/auth/auth-provider";
import { GoogleLoginButton } from "@/components/google-login-button/google-login-button";
import { NetworkBackground } from "@/components/network-background/network-background";
import { LanguageSelector } from "./language-selector";
import {
  loginTranslations,
  type LoginLocale,
} from "./login-translations";
import styles from "./page.module.css";

export default function LoginPage() {
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

  if (loading) {
    return (
      <main className={styles.main}>
        <NetworkBackground />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            position: "relative",
            zIndex: 1,
          }}
        >
          <CircularProgress sx={{ color: "#3b82f6" }} />
        </Box>
      </main>
    );
  }

  if (user) {
    return null;
  }

  const translation = loginTranslations[locale];

  const handleLocaleChange = (nextLocale: LoginLocale) => {
    setLocale(nextLocale);
    window.localStorage.setItem("login-locale", nextLocale);
  };

  return (
    <main className={styles.main}>
      <NetworkBackground />

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.leftSection}>
            <div className={styles.iconHeader}>
              <div className={styles.iconWrapper} aria-hidden="true">
                <div className={styles.iconSvg} />
              </div>
            </div>

            <h1 className={styles.title}>{translation.title}</h1>

            <p className={styles.subtext}>{translation.description}</p>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.loginText}>{translation.login}</div>
            <GoogleLoginButton label={translation.googleLogin} />
          </div>
        </div>

        <LanguageSelector
          locale={locale}
          onLocaleChange={handleLocaleChange}
          language={translation.language}
        />
      </div>
    </main>
  );
}
