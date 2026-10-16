"use client";

import { useEffect, useState } from "react";
import { authenticationSession } from "@/auth/authentication-session";
import { LogoutButton } from "@/components/logout-button/logout-button";
import styles from "./dashboard-header.module.css";

export const DashboardHeader = () => {
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const session = authenticationSession.getSession();
    if (session?.email) {
      setUserEmail(session.email);
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.toolbar}>
        <div className={styles.title}>Requirement Prioritization</div>

        <div className={styles.actions}>
          {userEmail && <div className={styles.chip}>{userEmail}</div>}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};
