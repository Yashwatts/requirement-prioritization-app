import { Domain } from "@/@types/domain.types";
import { DomainImpactUsers } from "@/@types/impact-users.types";
import { Institution } from "@/@types/institution.types";
import { RequirementTableRow, SortOrder } from "@/@types/requirement.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchDomains,
  fetchImpactUsers,
  fetchInstitutions,
  fetchRequirements,
} from "./requirement.action";

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface RequirementsState {
  requirements: RequirementTableRow[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;

  search: string;
  sortBy: string | undefined;
  sortOrder: SortOrder;

  institutions: Institution[];
  institutionsStatus: AsyncStatus;

  domains: Domain[];
  domainsStatus: AsyncStatus;

  impactUsers: DomainImpactUsers[];
  impactUsersStatus: AsyncStatus;

  status: AsyncStatus;
  error: string | null;
}

const initialState: RequirementsState = {
  requirements: [],
  total: 0,
  totalPages: 0,
  page: 1,
  limit: 10,
  search: "",
  sortBy: undefined,
  sortOrder: "DESC",

  institutions: [],
  institutionsStatus: "idle",

  domains: [],
  domainsStatus: "idle",

  impactUsers: [],
  impactUsersStatus: "idle",

  status: "idle",
  error: null,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequirements.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRequirements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requirements = action.payload.requirements;
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
      .addCase(fetchInstitutions.pending, (state) => {
        state.institutionsStatus = "loading";
      })
      .addCase(fetchInstitutions.fulfilled, (state, action) => {
        state.institutionsStatus = "succeeded";
        state.institutions = action.payload;
      })
      .addCase(fetchInstitutions.rejected, (state) => {
        state.institutionsStatus = "failed";
      });

    builder
      .addCase(fetchDomains.pending, (state) => {
        state.domainsStatus = "loading";
      })
      .addCase(fetchDomains.fulfilled, (state, action) => {
        state.domainsStatus = "succeeded";
        state.domains = action.payload;
      })
      .addCase(fetchDomains.rejected, (state) => {
        state.domainsStatus = "failed";
      });

    builder
      .addCase(fetchImpactUsers.pending, (state) => {
        state.impactUsersStatus = "loading";
      })
      .addCase(fetchImpactUsers.fulfilled, (state, action) => {
        state.impactUsersStatus = "succeeded";
        state.impactUsers = action.payload;
      })
      .addCase(fetchImpactUsers.rejected, (state) => {
        state.impactUsersStatus = "failed";
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
} = requirementSlice.actions;

export default requirementSlice.reducer;
