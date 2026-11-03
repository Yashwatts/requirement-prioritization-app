import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserTableSettings } from "@/types/table-settings.types";

export interface TableSettingsState {
  userSettings: Record<string, UserTableSettings>;
}

const initialState: TableSettingsState = {
  userSettings: {},
};

export const tableSettingsSlice = createSlice({
  name: "tableSettings",
  initialState,
  reducers: {
    saveTableSettings: (
      state,
      action: PayloadAction<{
        userId: string;
        columnOrder: string[];
        columnVisibility: Record<string, boolean>;
      }>,
    ) => {
      const { userId, columnOrder, columnVisibility } = action.payload;
      state.userSettings[userId] = {
        columnOrder,
        columnVisibility,
      };
    },
    resetTableSettings: (state, action: PayloadAction<{ userId: string }>) => {
      delete state.userSettings[action.payload.userId];
    },
  },
});

export const { saveTableSettings, resetTableSettings } =
  tableSettingsSlice.actions;

export default tableSettingsSlice.reducer;

