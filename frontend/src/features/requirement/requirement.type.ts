import {
  ClientPriority,
  Domain,
  RequirementStatus,
  RequirementTableRow,
  SortOrder,
} from "@/types/requirement.types";

export interface FetchImpactUsersParams {
  domainUuid?: string;
}

export interface CalculateImpactParams {
  benefited_institutions: string[];
  obligation: boolean;
  exist_solution_alternative: boolean;
  domain_in_charge_id: number;
  impact_number_users_id: string | number;
}

export interface CalculateImpactResponse {
  impact: number;
  client_priority: number;
  client_priority_name: "Low" | "Medium" | "High";
}

export interface ListRequirementsParams {
  search?: string;
  domain?: Domain;
  status?: RequirementStatus;
  clientPriority?: ClientPriority;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface PaginatedRequirements {
  requirements: RequirementTableRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserImpactRange {
  id?: number;
  from: number;
  to: number;
}

export interface UserImpactRanges {
  LOW: UserImpactRange;
  MEDIUM: UserImpactRange;
  HIGH: UserImpactRange;
  VERY_HIGH: UserImpactRange;
}

export interface DomainImpactUsers {
  domain_uuid: string;
  impact_users: UserImpactRanges;
}

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";
