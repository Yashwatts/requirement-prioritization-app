import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/features/auth/auth.slice";
import requirementsReducer from "@/features/requirement/requirement.slice";
import tableSettingsReducer from "@/features/table-settings/table-settings.slice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"],
};

const tableSettingsPersistConfig = {
  key: "tableSettings",
  storage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(
      authPersistConfig,
      authReducer,
    ) as unknown as typeof authReducer,
    requirements: requirementsReducer,
    tableSettings: persistReducer(
      tableSettingsPersistConfig,
      tableSettingsReducer,
    ) as unknown as typeof tableSettingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
