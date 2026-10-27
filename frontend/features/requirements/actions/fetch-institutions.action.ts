import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import { extractErrorMessage } from "../utils/error-handler";
import { InstitutionItem } from "@/@types/institution-item.types";

export const fetchInstitutions = createAsyncThunk<
  InstitutionItem[],
  void,
  { rejectValue: string }
>("requirements/fetchInstitutions", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<InstitutionItem[]>("/institutions");
    return response.data ?? [];
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
