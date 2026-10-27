import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import { extractErrorMessage } from "../utils/error-handler";
import { DomainItem } from "@/@types/domain-item.types";

export const fetchDomains = createAsyncThunk<
  DomainItem[],
  void,
  { rejectValue: string }
>("requirements/fetchDomains", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<DomainItem[]>("/domains");
    return response.data ?? [];
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
