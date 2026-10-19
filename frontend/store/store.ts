import { configureStore } from "@reduxjs/toolkit";
import requirementsReducer from "@/features/requirements/requirement.slice";

export const store = configureStore({
  reducer: {
    requirements: requirementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
