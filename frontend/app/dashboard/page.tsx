"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

import { useAuth } from "@/auth/auth-provider";
import { RequirementsTable } from "@/components/dashboard/requirements-table/requirements-table";
import { CreateRequirementDrawer } from "@/components/dashboard/create-requirement/create-requirement-drawer";
import { Sidebar } from "@/components/dashboard/sidebar/sidebar";
import { Topbar } from "@/components/dashboard/topbar/topbar";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [requirementsRefreshToken, setRequirementsRefreshToken] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return <Box className={styles.loadingState}><CircularProgress /></Box>;
  }

  if (!user) return null;

  return (
    <Box className={styles.page}>
      <Topbar user={user} onMenuClick={() => setSidebarOpen((open) => !open)} />
      <Sidebar open={sidebarOpen} />
      <Box component="main" className={styles.content}>
        <RequirementsTable
          onCreateNew={() => setCreateOpen(true)}
          refreshToken={requirementsRefreshToken}
        />
      </Box>
      <CreateRequirementDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => setRequirementsRefreshToken((value) => value + 1)}
      />
    </Box>
  );
}
