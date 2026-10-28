import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout/dashboard-layout";

export const metadata: Metadata = {
  title: "Dashboard | Requirement Prioritization",
  description: "Requirement Prioritization Management Dashboard",
};

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
