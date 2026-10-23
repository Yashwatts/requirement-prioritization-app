"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";

import { useAuth } from "@/auth/auth-provider";
import { Sidebar } from "@/components/dashboard/sidebar/sidebar";
import { Topbar } from "@/components/dashboard/topbar/topbar";
import styles from "@/app/dashboard/page.module.css";

interface DashboardLayoutClientProps {
  children: ReactNode;
}

export const DashboardLayoutClient = ({
  children,
}: DashboardLayoutClientProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  return (
    <Box className={styles.page}>
      <Topbar
        user={user}
        onMenuClick={() => setSidebarOpen((open) => !open)}
      />
      <Sidebar open={sidebarOpen} />
      <Box component="main" className={styles.content}>
        {children}
      </Box>
    </Box>
  );
};
