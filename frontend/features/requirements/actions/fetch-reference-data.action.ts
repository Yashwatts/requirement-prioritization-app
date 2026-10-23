import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config/api";
import { extractErrorMessage } from "../utils/error-handler";
import { DomainItem } from "@/@types/domain-item.types";
import { InstitutionItem } from "@/@types/institution-item.types";
import { ImpactUsersDomainItem } from "@/@types/impact-users-domain-item.types";

export interface ReferenceDataResult {
  domains: DomainItem[];
  institutions: InstitutionItem[];
  impactLevels: ImpactUsersDomainItem[];
}

export const fetchReferenceData = createAsyncThunk<
  ReferenceDataResult,
  void,
  { rejectValue: string }
>("requirements/fetchReferenceData", async (_, { rejectWithValue }) => {
  try {
    const [domainsRes, institutionsRes, impactLevelsRes] = await Promise.all([
      api.get<DomainItem[]>("/domains"),
      api.get<InstitutionItem[]>("/institutions"),
      api.get<ImpactUsersDomainItem[]>("/impact-levels"),
    ]);

    return {
      domains: domainsRes.data ?? [],
      institutions: institutionsRes.data ?? [],
      impactLevels: impactLevelsRes.data ?? [],
    };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
