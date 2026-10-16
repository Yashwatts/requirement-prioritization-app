"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useSnackbar } from "@/components/snackbar/use-snackbar";
import { authenticationSession } from "./authentication-session";
import { authenticationService } from "./authentication-service";

interface AuthenticationSessionGuardProps {
  children: ReactNode;
}

export const AuthenticationSessionGuard = ({
  children,
}: AuthenticationSessionGuardProps) => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const hasHandledExpiration = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = authenticationSession.getSession();

      if (session) {
        return;
      }

      if (hasHandledExpiration.current) {
        return;
      }

      hasHandledExpiration.current = true;

      await authenticationService.signOut();

      showSnackbar("Your session has expired. Please log in again.", "warning");

      router.replace("/login");
      router.refresh();
    };

    void checkSession();

    const handleFocus = () => {
      void checkSession();
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === "requirement-prioritization-session" &&
        !event.newValue
      ) {
        void checkSession();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    const interval = window.setInterval(() => {
      void checkSession();
    }, 5000);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [router, showSnackbar]);

  return children;
};
