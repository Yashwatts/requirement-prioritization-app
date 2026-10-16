import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
