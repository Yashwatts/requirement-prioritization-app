import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import { extractErrorMessage } from "../utils/error-handler";
import { DomainImpactUsers } from "@/@types/impact-users.types";

export interface FetchImpactUsersParams {
  domainUuid?: string;
}

export const fetchImpactUsers = createAsyncThunk<
  DomainImpactUsers[],
  FetchImpactUsersParams | void,
  { rejectValue: string }
>("requirements/fetchImpactUsers", async (params, { rejectWithValue }) => {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.domainUuid) queryParams.domain_uuid = params.domainUuid;

    const response = await api.get<DomainImpactUsers[]>("/impact-users", {
      params: queryParams,
    });
    return response.data ?? [];
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
