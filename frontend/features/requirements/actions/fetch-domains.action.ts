import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import { extractErrorMessage } from "../utils/error-handler";
import { Domain } from "@/@types/domain.types";

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
