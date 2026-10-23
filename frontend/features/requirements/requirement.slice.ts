import { DomainItem } from "@/@types/domain-item.types";
import { ImpactUsersDomainItem } from "@/@types/impact-users-domain-item.types";
import { InstitutionItem } from "@/@types/institution-item.types";
import { RequirementListItem, SortOrder } from "@/@types/requirement.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createRequirement,
  fetchReferenceData,
  fetchRequirements,
} from "./requirement.action";

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface RequirementsState {
  items: RequirementListItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;

  search: string;
  sortBy: string | undefined;
  sortOrder: SortOrder;

  institutions: InstitutionItem[];
  domains: DomainItem[];
  impactLevels: ImpactUsersDomainItem[];
  referenceDataStatus: AsyncStatus;

  status: AsyncStatus;
  error: string | null;

  actionStatus: AsyncStatus;
  actionError: string | null;
  actionSuccess: string | null;
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

  institutions: [],
  domains: [],
  impactLevels: [],
  referenceDataStatus: "idle",

  status: "idle",
  error: null,

  actionStatus: "idle",
  actionError: null,
  actionSuccess: null,
};

export const requirementSlice = createSlice({
  name: "requirements",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action: PayloadAction<string | undefined>) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
      state.page = 1;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === "ASC" ? "DESC" : "ASC";
      state.page = 1;
    },
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.actionError = null;
      state.actionSuccess = null;
    },
  },
  extraReducers: (builder) => {
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
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchRequirements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load requirements.";
      });

    builder
      .addCase(createRequirement.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
        state.actionSuccess = null;
      })
      .addCase(createRequirement.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.actionSuccess =
          action.payload.message ?? "Requirement registered successfully.";
      })
      .addCase(createRequirement.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload ?? "Failed to create requirement.";
      });

    builder
      .addCase(fetchReferenceData.pending, (state) => {
        state.referenceDataStatus = "loading";
      })
      .addCase(fetchReferenceData.fulfilled, (state, action) => {
        state.referenceDataStatus = "succeeded";
        state.domains = action.payload.domains;
        state.institutions = action.payload.institutions;
        state.impactLevels = action.payload.impactLevels;
      })
      .addCase(fetchReferenceData.rejected, (state) => {
        state.referenceDataStatus = "failed";
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
  resetActionStatus,
} = requirementSlice.actions;

export default requirementSlice.reducer;
