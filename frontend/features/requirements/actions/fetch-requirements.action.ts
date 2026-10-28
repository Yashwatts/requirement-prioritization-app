import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import { extractErrorMessage } from "../utils/error-handler";
import {
  ListRequirementsParams,
  PaginatedRequirements,
} from "@/@types/requirement.types";

export const fetchRequirements = createAsyncThunk<
  PaginatedRequirements,
  ListRequirementsParams | undefined,
  { rejectValue: string }
>(
  "requirements/fetchRequirements",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams: Record<string, string | number> = {};

      if (params.search) queryParams.search = params.search;

      const domain = params.domain ?? params.domain_in_charge_id;
      if (domain !== undefined) queryParams.domain = domain;

      if (params.status !== undefined) {
        queryParams.status = params.status;
      }

      const clientPriority = params.clientPriority ?? params.client_priority;
      if (clientPriority !== undefined) {
        queryParams.client_priority = clientPriority;
      }

      const sortBy = params.sortBy ?? params.sort_by;
      if (sortBy) queryParams.sort_by = sortBy;

      const sortOrder = params.sortOrder ?? params.sort_order ?? "DESC";
      queryParams.sort_order = sortOrder;

      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;

      const response = await api.get<PaginatedRequirements>(
        "/requirements",
        { params: queryParams },
      );

      const backendResult = response.data;
      const requirements =
        backendResult.requirements ?? (backendResult as unknown as { rows: PaginatedRequirements["requirements"] }).rows ?? [];
      const limit = backendResult.limit ?? params.limit ?? 10;
      const total = backendResult.total ?? 0;
      const totalPages =
        backendResult.totalPages ??
        (Math.ceil(total / limit) > 0 ? Math.ceil(total / limit) : 1);

      return {
        requirements,
        total,
        page: backendResult.page ?? params.page ?? 1,
        limit,
        totalPages,
      };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);
