"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import { Sidebar } from "@/shared/sidebar/sidebar";
import { Navbar } from "@/shared/navbar/navbar";
import styles from "./dashboard-layout.module.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  return (
    <Box className={styles.page}>
      <Navbar
        user={user}
        onMenuClick={() =>
          setSidebarOpen((isPreviouslyOpen) => !isPreviouslyOpen)
        }
      />
      <Sidebar open={sidebarOpen} />
      <Box
        component="main"
        className={`${styles.content} ${sidebarOpen ? styles.contentExpanded : ""}`}
      >
        {children}
      </Box>
    </Box>
  );
};
