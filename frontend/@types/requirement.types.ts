export type RequestingInstitution = string;

export type BenefitedInstitution = string;

export type StudyModality = "Virtual" | "Presencial" | "Virtual/Presencial";

export type UserImpactLevel = "Low" | "Medium" | "High" | "Very High";

export type ComplexityEffort = "XS" | "S" | "M" | "L" | "XL";

export type ClientPriority = "Low" | "Medium" | "High";

export type Domain =
  | "Financiero"
  | "Reincorporaciones"
  | "Ventas"
  | "Marketing Digital"
  | "Administración Académica"
  | "Logística"
  | "Maquetación"
  | "Presencia Web"
  | "Envíos Masivos"
  | "Docencia Académica"
  | "Catálogo Formativo"
  | "Planificación Educativa"
  | "Gestión Docente"
  | "Acción Docente"
  | "Calidad Universitaria"
  | "Reportería"
  | "ESEC"
  | "Proyectos Europeos";

export type RequirementStatus = "Registered" | "Flow";

export type RequirementType = "Internal" | "External" | "Client";

export const ClientPriorityEnum = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

export const ComplexityEffortEnum = {
  XS: 1,
  S: 2,
  M: 3,
  L: 4,
  XL: 5,
} as const;

export const RequirementStatusEnum = {
  REGISTERED: 1,
  FLOW: 2,
} as const;

export const RequirementStateEnum = RequirementStatusEnum;

export const RequirementTypeEnum = {
  INTERNAL: 1,
  EXTERNAL: 2,
  CLIENT: 3,
} as const;

export const StudyModalityEnum = {
  VIRTUAL: 1,
  PRESENCIAL: 2,
  VIRTUAL_PRESENCIAL: 3,
} as const;

export const UserImpactLevelEnum = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
} as const;

export interface RequirementDetail {
  id: number;
  uuid: string;
  code: number;
  status: number;
  name: string;
  description: string;
  requesting_institution_id: number;
  requesting_institution_name: string | null;
  requesting_institution: {
    id: number;
    uuid: string;
    name: string;
  } | null;
  requested_by: string[];
  benefited_institutions: string[];
  total_benefited_institutions: number;
  obligation: boolean;
  exist_solution_alternative: boolean;
  study_modality: number;
  impact_number_users_id: number;
  impact: number;
  complexity_and_effort: number;
  client_priority: number;
  domain_in_charge_id: number;
  domain_in_charge_name: string | null;
  domain_in_charge: {
    id: number;
    uuid: string;
    name: string;
    abbreviation?: string;
  } | null;
  domains_collaborators: string[];
  followers_domains: string[];
  development_time_in_sprints: number | null;
  start_date: string | null;
  end_date: string | null;
  type: number;
  created_at: string;
  updated_at: string;
}

export interface BackendListRequirementsResult {
  total: number;
  limit: number;
  page: number;
  rows: RequirementDetail[];
}

export interface RequirementListItem {
  id: string;
  numericId: number;
  code: number;
  name: string;
  description: string;
  requestingInstitution: RequestingInstitution;
  requestingInstitutionId: number;
  requestedBy: string;
  requestedByList: string[];
  domain: Domain;
  domainId: number;
  collaboratorDomains: Domain[];
  followerDomains: Domain[];
  benefitedInstitutions: BenefitedInstitution[];
  totalBenefitedInstitutions: number;
  isObligatory: boolean;
  hasAlternativeSolution: boolean;
  studyModalities: StudyModality[];
  studyModalityId: number;
  impactUsers: UserImpactLevel;
  impactUsersId: number;
  impact: number;
  complexityEffort: ComplexityEffort;
  complexityEffortId: number;
  clientPriority: ClientPriority;
  clientPriorityId: number;
  status: RequirementStatus;
  statusId: number;
  state?: RequirementStatus;
  stateId?: number;
  type: RequirementType;
  typeId: number;
  developmentTimeInSprints: number | null;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedRequirements {
  items: RequirementListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SortOrder = "ASC" | "DESC";

export interface ListRequirementsParams {
  search?: string;
  domain?: Domain;
  domain_in_charge_id?: number;
  status?: RequirementStatus | number;
  clientPriority?: ClientPriority | number;
  client_priority?: ClientPriority | number;
  sortBy?: string;
  sort_by?: string;
  sortOrder?: SortOrder;
  sort_order?: SortOrder;
  page?: number;
  limit?: number;
}

export interface CreateRequirementPayload {
  name: string;
  description: string;
  requesting_institution_id: number;
  requested_by: string[];
  benefited_institutions: string[];
  study_modality: number;
  impact_number_users_id: number;
  impact_users_value?: number;
  obligation: boolean;
  exist_solution_alternative: boolean;
  complexity_and_effort: number;
  client_priority?: number;
  domain_in_charge_id: number;
  domains_collaborators?: string[];
  followers_domains?: string[];
  development_time_in_sprints?: number;
  start_date?: string;
  end_date?: string;
  type: number;
  status?: number;
}
