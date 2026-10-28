"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";
import { authService } from "@/features/auth/auth.service";
import { setUser } from "@/features/auth/auth.slice";
import { Loading } from "@/shared/loading/loading";

const emptySubscribe = () => () => {};

function useIsClientMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function AuthStateListener({ children }: { children: ReactNode }) {
  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthState(
      (firebaseUser) => {
        if (firebaseUser) {
          store.dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            }),
          );
        } else {
          store.dispatch(setUser(null));
        }
      },
      () => {
        store.dispatch(setUser(null));
      },
    );

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const isClientMounted = useIsClientMounted();

  return (
    <Provider store={store}>
      {isClientMounted ? (
        <PersistGate loading={<Loading />} persistor={persistor}>
          <AuthStateListener>{children}</AuthStateListener>
        </PersistGate>
      ) : (
        <Loading />
      )}
    </Provider>
  );
}
