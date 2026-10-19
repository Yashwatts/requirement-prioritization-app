import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RequirementListItem, SortOrder } from "./requirement.types";
import { fetchRequirements } from "./requirement.action";

// ============================================================
// State shape
// ============================================================

export type RequirementsStatus = "idle" | "loading" | "succeeded" | "failed";

export interface RequirementsState {
  // Data
  items: RequirementListItem[];
  total: number;
  totalPages: number;

  // Pagination
  page: number;
  limit: number;

  // Filters / search / sort
  search: string;
  sortBy: string | undefined;
  sortOrder: SortOrder;

  // Async status
  status: RequirementsStatus;
  error: string | null;
}

const initialState: RequirementsState = {
  items: [],
  total: 0,
  totalPages: 0,
  page: 1,
  limit: 16,
  search: "",
  sortBy: undefined,
  sortOrder: "ASC",
  status: "idle",
  error: null,
};

// ============================================================
// Slice
// ============================================================

const requirementsSlice = createSlice({
  name: "requirements",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1; // reset to first page when limit changes
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1; // reset to first page when search changes
    },
    setSortBy(state, action: PayloadAction<string | undefined>) {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setSortOrder(state, action: PayloadAction<SortOrder>) {
      state.sortOrder = action.payload;
      state.page = 1;
    },
    toggleSortOrder(state) {
      state.sortOrder = state.sortOrder === "ASC" ? "DESC" : "ASC";
      state.page = 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRequirements.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRequirements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        // Keep page/limit in sync with what the backend confirmed
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchRequirements.rejected, (state, action) => {
        state.status = "failed";
        state.items = [];
        state.total = 0;
        state.totalPages = 0;
        state.error = action.payload ?? "Failed to load requirements.";
      });
  },
});

export const {
  setPage,
  setLimit,
  setSearch,
  setSortBy,
  setSortOrder,
  toggleSortOrder,
} = requirementsSlice.actions;

export default requirementsSlice.reducer;
