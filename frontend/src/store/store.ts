import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/features/auth/auth.slice";
import requirementsReducer from "@/features/requirement/requirement.slice";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authReducer) as unknown as typeof authReducer,
    requirements: requirementsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
