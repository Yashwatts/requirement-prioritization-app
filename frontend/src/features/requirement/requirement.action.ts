import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/axios";
import { extractErrorMessage } from "@/utils/error-handler";
import { Domain } from "@/types/domain.types";
import { Institution } from "@/types/institution.types";
import { CreateRequirementPayload } from "@/types/requirement.types";
import {
  CalculateImpactParams,
  CalculateImpactResponse,
  DomainImpactUsers,
  FetchImpactUsersParams,
  ListRequirementsParams,
  PaginatedRequirements,
} from "./requirement.type";

export const fetchRequirements = createAsyncThunk<
  PaginatedRequirements,
  ListRequirementsParams | undefined,
  { rejectValue: string }
>(
  "requirements/fetchRequirements",
  async (parameters = {}, { rejectWithValue }) => {
    try {
      const queryParams: Record<string, string | number> = {};
      if (parameters.search) {
        queryParams.search = parameters.search;
      }
      if (parameters.domain !== undefined) {
        queryParams.domain = parameters.domain;
      }
      if (parameters.status !== undefined) {
        queryParams.status = parameters.status;
      }
      if (parameters.clientPriority !== undefined) {
        queryParams.client_priority = parameters.clientPriority;
      }
      if (parameters.sortBy) {
        queryParams.sort_by = parameters.sortBy;
      }
      queryParams.sort_order = parameters.sortOrder ?? "DESC";
      if (parameters.page !== undefined) {
        queryParams.page = parameters.page;
      }
      if (parameters.limit !== undefined) {
        queryParams.limit = parameters.limit;
      }

      const response = await api.get<PaginatedRequirements>("/requirements", {
        params: queryParams,
      });

      const backendResult = response.data;
      const requirements =
        backendResult.requirements ??
        (
          backendResult as unknown as {
            rows: PaginatedRequirements["requirements"];
          }
        ).rows ??
        [];
      const limit = backendResult.limit ?? parameters.limit ?? 10;
      const total = backendResult.total ?? 0;
      const totalPages =
        backendResult.totalPages ??
        (Math.ceil(total / limit) > 0 ? Math.ceil(total / limit) : 1);

      return {
        requirements,
        total,
        page: backendResult.page ?? parameters.page ?? 1,
        limit,
        totalPages,
      };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const createRequirement = createAsyncThunk<
  { message: string },
  CreateRequirementPayload,
  { rejectValue: string }
>("requirements/createRequirement", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<{ message: string }>(
      "/requirements",
      payload,
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchInstitutions = createAsyncThunk<
  Institution[],
  void,
  { rejectValue: string }
>("requirements/fetchInstitutions", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Institution[]>("/institutions");
    return response.data ?? [];
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchDomains = createAsyncThunk<
  Domain[],
  void,
  { rejectValue: string }
>("requirements/fetchDomains", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Domain[]>("/domains");
    return response.data ?? [];
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchImpactUsers = createAsyncThunk<
  DomainImpactUsers[],
  FetchImpactUsersParams | void,
  { rejectValue: string }
>("requirements/fetchImpactUsers", async (parameters, { rejectWithValue }) => {
  try {
    const queryParams: Record<string, string> = {};
    if (parameters?.domainUuid) {
      queryParams.domain_uuid = parameters.domainUuid;
    }

    const response = await api.get<DomainImpactUsers[]>("/impact-users", {
      params: queryParams,
    });
    return response.data ?? [];
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const calculateImpact = createAsyncThunk<
  CalculateImpactResponse,
  CalculateImpactParams,
  { rejectValue: string }
>("requirements/calculateImpact", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<CalculateImpactResponse>(
      "/requirements/calculate-impact",
      payload,
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
