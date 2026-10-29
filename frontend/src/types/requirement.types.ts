export type RequestingInstitution = string;

export type BenefitedInstitution = string;

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

export const STUDY_MODALITIES = [
  "Virtual",
  "Presencial",
  "Virtual/Presencial",
] as const;
export type StudyModality = (typeof STUDY_MODALITIES)[number];

export const USER_IMPACT_LEVELS = [
  "Low",
  "Medium",
  "High",
  "Very High",
] as const;
export type UserImpactLevel = (typeof USER_IMPACT_LEVELS)[number];

export const COMPLEXITY_EFFORTS = ["XS", "S", "M", "L", "XL"] as const;
export type ComplexityEffort = (typeof COMPLEXITY_EFFORTS)[number];

export const CLIENT_PRIORITIES = ["Low", "Medium", "High"] as const;
export type ClientPriority = (typeof CLIENT_PRIORITIES)[number];

export const REQUIREMENT_STATUSES = ["Registered", "Flow"] as const;
export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number];

export const REQUIREMENT_TYPES = ["Internal", "External", "Client"] as const;
export type RequirementType = (typeof REQUIREMENT_TYPES)[number];

export const YES_NO_OPTIONS = ["Yes", "No"] as const;
export type YesNoOption = (typeof YES_NO_OPTIONS)[number];

export interface RequirementTableRow {
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

export type SortOrder = "ASC" | "DESC";

export interface CreateRequirementPayload {
  name: string;
  description: string;
  requesting_institution_id: number;
  requested_by: string[];
  benefited_institutions: string[];
  study_modality: StudyModality | number | string | string[];
  impact_number_users_id: string | number;
  impact_users_value?: number;
  obligation: boolean;
  exist_solution_alternative: boolean;
  complexity_and_effort: ComplexityEffort | number | string;
  client_priority?: ClientPriority | number | string;
  domain_in_charge_id: number;
  domains_collaborators?: string[];
  followers_domains?: string[];
  development_time_in_sprints?: number;
  start_date?: string;
  end_date?: string;
  type: RequirementType | number | string;
  status?: RequirementStatus | number | string;
}
