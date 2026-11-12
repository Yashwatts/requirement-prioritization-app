export const STUDY_MODALITIES = [
  "Virtual",
  "Presencial",
  "Virtual/Presencial",
] as const;

export const COMPLEXITY_EFFORTS = ["XS", "S", "M", "L", "XL"] as const;

export const CLIENT_PRIORITIES = ["Low", "Medium", "High"] as const;

export const REQUIREMENT_STATUSES = ["Registered", "Flow"] as const;

export const REQUIREMENT_TYPES = ["Internal", "External", "Client"] as const;

export const YES_NO_OPTIONS = ["Yes", "No"] as const;

export interface RequirementTableRow {
  id: string;
  numericId: number;
  code: number;
  name: string;
  description: string;
  requestingInstitution: string;
  requestingInstitutionId: number;
  requestedBy: string;
  requestedByList: string[];
  domain: string;
  domainId: number;
  collaboratorDomains: string[];
  followerDomains: string[];
  benefitedInstitutions: string[];
  totalBenefitedInstitutions: number;
  isObligatory: boolean;
  hasAlternativeSolution: boolean;
  studyModalities: string[];
  studyModalityId?: number | string;
  impactUsers: string;
  impactUsersId: number;
  impact: number;
  complexityEffort: string;
  complexityEffortId?: number | string;
  clientPriority: string;
  clientPriorityId?: number | string;
  status: string;
  statusId?: number | string;
  state?: string;
  stateId?: number;
  type: string;
  typeId?: number | string;
  developmentTimeInSprints: number | null;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SortOrder = "ASC" | "DESC";

export interface CreateRequirementPayload {
  name: string;
  description: string;
  requesting_institution_id: number;
  requested_by: string[];
  benefited_institutions: string[];
  study_modality: string | number | string[];
  impact_number_users_id: string | number;
  impact?: number;
  obligation: boolean;
  exist_solution_alternative: boolean;
  complexity_and_effort: string | number;
  client_priority?: string | number;
  domain_in_charge_id: number;
  domains_collaborators?: string[];
  followers_domains?: string[];
  development_time_in_sprints?: number;
  start_date?: string;
  end_date?: string;
  type: string | number;
  status?: string | number;
}
