import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";

export const metadata: Metadata = {
  title: "Dashboard | Requirement Prioritization",
  description: "Requirement Prioritization Management Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
