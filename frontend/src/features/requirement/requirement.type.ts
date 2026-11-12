import {
  RequirementTableRow,
  SortOrder,
} from "@/types/requirement.types";

export interface FetchImpactUsersParams {
  domainUuid?: string;
}

export interface ListRequirementsParams {
  search?: string;
  domain?: string;
  status?: string;
  clientPriority?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  append?: boolean;
}

export interface PaginatedRequirements {
  requirements: RequirementTableRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ImpactUserItem {
  id: number;
  name: string;
  from: number;
  to: number;
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
  impact_users: ImpactUserItem[] | UserImpactRanges;
}

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";
