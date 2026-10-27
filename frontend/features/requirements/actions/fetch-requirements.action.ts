import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import {
  mapBackendToListItem,
  mapClientPriorityToNumber,
  mapStatusToNumber,
} from "../mappers/requirement.mapper";
import { extractErrorMessage } from "../utils/error-handler";
import {
  BackendListRequirementsResult,
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
        queryParams.status = mapStatusToNumber(params.status);
      }

      const clientPriority = params.clientPriority ?? params.client_priority;
      if (clientPriority !== undefined) {
        queryParams.client_priority = mapClientPriorityToNumber(clientPriority);
      }

      const sortBy = params.sortBy ?? params.sort_by;
      if (sortBy) queryParams.sort_by = sortBy;

      const sortOrder = params.sortOrder ?? params.sort_order;
      if (sortOrder) queryParams.sort_order = sortOrder;

      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;

      const response = await api.get<BackendListRequirementsResult>(
        "/requirements",
        { params: queryParams },
      );

      const data = response.data;
      const items = (data.rows ?? []).map(mapBackendToListItem);
      const limit = data.limit ?? params.limit ?? 10;
      const total = data.total ?? 0;
      const totalPages = Math.ceil(total / limit) > 0 ? Math.ceil(total / limit) : 1;

      return {
        items,
        total,
        page: data.page ?? params.page ?? 1,
        limit,
        totalPages,
      };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);
