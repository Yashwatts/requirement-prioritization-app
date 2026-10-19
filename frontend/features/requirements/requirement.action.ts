import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { api } from "@/config/api";
import type {
  ListRequirementsParams,
  PaginatedRequirements,
} from "./requirement.types";

// ============================================================
// fetchRequirements
// Calls GET /api/requirements with the provided query params.
// Returns the paginated envelope: { items, total, page, limit, totalPages }
// ============================================================

export const fetchRequirements = createAsyncThunk<
  PaginatedRequirements,
  ListRequirementsParams,
  { rejectValue: string }
>("requirements/fetchRequirements", async (params, { rejectWithValue }) => {
  try {
    // Build query params, omitting undefined values so axios doesn't
    // send empty keys to the backend.
    const queryParams: Record<string, string | number> = {};

    if (params.search) queryParams.search = params.search;
    if (params.domain) queryParams.domain = params.domain;
    if (params.state) queryParams.state = params.state;
    if (params.clientPriority) queryParams.clientPriority = params.clientPriority;
    if (params.managementPriority)
      queryParams.managementPriority = params.managementPriority;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;

    const response = await api.get<PaginatedRequirements>("/requirements", {
      params: queryParams,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message =
        (error.response?.data as { message?: string })?.message ??
        error.message;
      return rejectWithValue(message);
    }
    return rejectWithValue("An unexpected error occurred.");
  }
});
