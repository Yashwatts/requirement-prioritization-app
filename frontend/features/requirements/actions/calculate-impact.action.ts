import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import { extractErrorMessage } from "../utils/error-handler";

export interface CalculateImpactParams {
  benefited_institutions: string[];
  obligation: boolean;
  exist_solution_alternative: boolean;
  domain_in_charge_id: number;
  impact_number_users_id: number;
}

export interface CalculateImpactResponse {
  impact: number;
  client_priority: number;
  client_priority_name: "Low" | "Medium" | "High";
}

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
