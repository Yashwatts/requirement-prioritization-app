import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import { extractErrorMessage } from "../utils/error-handler";
import { Institution } from "@/@types/institution.types";

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
