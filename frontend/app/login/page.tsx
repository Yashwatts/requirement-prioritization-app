import type { Metadata } from "next";
import { LoginView } from "@/components/login/login-view";

export const metadata: Metadata = {
  title: "Login | Requirement Prioritization",
  description: "Sign in to Requirement Prioritization",
};

export default function LoginPage() {
  return <LoginView />;
}
