import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import { extractErrorMessage } from "../utils/error-handler";
import { CreateRequirementPayload } from "@/@types/requirement.types";

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
