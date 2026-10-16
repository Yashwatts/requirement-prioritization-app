"use client";

import { firebaseAuth } from "@/config/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

const SESSION_KEY = "requirement-prioritization-session";
const SESSION_DURATION = 60 * 60 * 1000;

interface AuthenticationSession {
  email: string;
  name: string;
  expiresAt: number;
}

const createSession = (user: User): AuthenticationSession => ({
  email: user.email ?? "",
  name: user.displayName ?? "",
  expiresAt: Date.now() + SESSION_DURATION,
});

const setCookie = (
  name: string,
  value: string,
  maxAgeSeconds: number,
): void => {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
};

const deleteCookie = (name: string): void => {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  const parts = match.split("=");
  const cookieValue = parts.slice(1).join("=");

  try {
    return decodeURIComponent(cookieValue);
  } catch {
    return null;
  }
};

const saveSession = (session: AuthenticationSession): void => {
  const sessionString = JSON.stringify(session);
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, sessionString);
  }
  setCookie(SESSION_KEY, sessionString, Math.floor(SESSION_DURATION / 1000));
};

const clearSession = (): void => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_KEY);
  }
  deleteCookie(SESSION_KEY);
};

const getSession = (): AuthenticationSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const sessionFromStorage = sessionStorage.getItem(SESSION_KEY);

  if (!sessionFromStorage) {
    deleteCookie(SESSION_KEY);
    return null;
  }

  try {
    const parsedSession = JSON.parse(sessionFromStorage) as AuthenticationSession;

    if (parsedSession.expiresAt <= Date.now()) {
      clearSession();
      return null;
    }

    return parsedSession;
  } catch {
    clearSession();
    return null;
  }
};

const logout = async (): Promise<void> => {
  clearSession();
  await signOut(firebaseAuth);
};

const startSession = (user: User): AuthenticationSession => {
  const session = createSession(user);

  saveSession(session);

  return session;
};

const subscribeToAuthenticationState = (
  callback: (user: User | null) => void,
) => {
  return onAuthStateChanged(firebaseAuth, callback);
};

export const authenticationSession = {
  createSession,
  getSession,
  clearSession,
  logout,
  startSession,
  subscribeToAuthenticationState,
};
