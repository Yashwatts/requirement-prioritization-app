// ============================================================
// Requirement domain types — mirror of backend domain/types.ts
// These must stay in sync with the backend enum values.
// ============================================================

export type RequestingInstitution =
  | "FUNIBER"
  | "UNEATLANTICO"
  | "UNIC"
  | "UNINCOL"
  | "UNIB"
  | "UNINI-MX"
  | "UNIROMANA"
  | "UDAS"
  | "Grupo Funiber"
  | "Proyectos Europeos";

export type BenefitedInstitution =
  | "FUNIBER"
  | "UNEATLANTICO"
  | "UNIC"
  | "UNINCOL"
  | "UNIB"
  | "UNINI-MX"
  | "UNIROMANA"
  | "UDAS"
  | "Proyectos Europeos";

export type StudyModality = "Virtual" | "Presencial" | "Virtual/Presencial";

export type UserImpactLevel = "Low" | "Medium" | "High" | "Very High";

export type ComplexityEffort = "XS" | "S" | "M" | "L" | "XL";

export type ClientPriority = "Low" | "Medium" | "High";

export type ManagementPriority = "Under" | "Medium" | "High" | "Discarded";

export type DomainArea =
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

export type RequirementState = "Registered" | "Flow";

export type RequirementType = "Internal" | "External" | "Client";

// ============================================================
// Backend API response shapes
// ============================================================

/** Single item in the GET /api/requirements `items` array */
export interface RequirementListItem {
  id: string;
  code: number;
  name: string;
  requestingInstitution: RequestingInstitution;
  requestedBy: string;
  domain: DomainArea;
  collaboratorDomains: DomainArea[];
  followerDomains: DomainArea[];
  benefitedInstitutions: BenefitedInstitution[];
  totalBenefitedInstitutions: number;
  isObligatory: boolean;
  hasAlternativeSolution: boolean;
  studyModalities: StudyModality[];
  impactUsers: UserImpactLevel;
  impact: number;
  complexityEffort: ComplexityEffort;
  clientPriority: ClientPriority;
  managementPriority: ManagementPriority;
  state: RequirementState;
  type: RequirementType;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
}

/** Pagination envelope returned by GET /api/requirements */
export interface PaginatedRequirements {
  items: RequirementListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Query parameters for GET /api/requirements
// ============================================================

export type SortOrder = "ASC" | "DESC";

export interface ListRequirementsParams {
  search?: string;
  domain?: DomainArea;
  state?: RequirementState;
  clientPriority?: ClientPriority;
  managementPriority?: ManagementPriority;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}
