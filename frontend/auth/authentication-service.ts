"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { authenticationSession } from "./authentication-session";
import { AuthenticatedUser } from "@/@types/authentication.types";
import { firebaseAuth } from "@/config/firebase";

const googleProvider = new GoogleAuthProvider();

export const authenticationService = {
  async signInWithGoogle(): Promise<AuthenticatedUser> {
    const result = await signInWithPopup(firebaseAuth, googleProvider);

    const email = result.user.email;

    if (!email) {
      throw new Error("No email associated with this Google account.");
    }

    authenticationSession.startSession(result.user);

    return {
      email,
      name: result.user.displayName ?? "",
    };
  },

  async signOut(): Promise<void> {
    await authenticationSession.logout();
  },
};
