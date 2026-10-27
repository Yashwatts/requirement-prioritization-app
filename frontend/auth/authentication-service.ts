import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const authenticationService = {
  async signInWithGoogle(): Promise<User> {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    if (!result.user.email) {
      throw new Error("No email associated with this Google account.");
    }
    return result.user;
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(firebaseAuth);
  },

  getCurrentUser(): User | null {
    return firebaseAuth.currentUser;
  },

  subscribeToAuthState(
    callback: (user: User | null) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    return onAuthStateChanged(firebaseAuth, callback, onError);
  },
};
