import {
  BackendEnrichedRequirement,
  BenefitedInstitution,
  ClientPriority,
  ComplexityEffort,
  DomainArea,
  ManagementPriority,
  RequestingInstitution,
  RequirementListItem,
  RequirementState,
  RequirementType,
  StudyModality,
  UserImpactLevel,
} from "@/@types/requirement.types";

export function mapNumberToClientPriority(num: number): ClientPriority {
  switch (num) {
    case 1:
      return "Low";
    case 2:
      return "Medium";
    case 3:
      return "High";
    default:
      return "Low";
  }
}

export function mapClientPriorityToNumber(
  priority: ClientPriority | number,
): number {
  if (typeof priority === "number") return priority;
  switch (priority) {
    case "Low":
      return 1;
    case "Medium":
      return 2;
    case "High":
      return 3;
    default:
      return 1;
  }
}

export function mapNumberToManagementPriority(
  num?: number | null,
): ManagementPriority {
  switch (num) {
    case 1:
      return "Under";
    case 2:
      return "Medium";
    case 3:
      return "High";
    case 4:
      return "Discarded";
    default:
      return "Under";
  }
}

export function mapManagementPriorityToNumber(
  priority?: ManagementPriority | number,
): number {
  if (typeof priority === "number") return priority;
  switch (priority) {
    case "Under":
      return 1;
    case "Medium":
      return 2;
    case "High":
      return 3;
    case "Discarded":
      return 4;
    default:
      return 1;
  }
}

export function mapNumberToState(num: number): RequirementState {
  switch (num) {
    case 1:
      return "Registered";
    case 2:
      return "Flow";
    default:
      return "Registered";
  }
}

export function mapStateToNumber(state: RequirementState | number): number {
  if (typeof state === "number") return state;
  switch (state) {
    case "Registered":
      return 1;
    case "Flow":
      return 2;
    default:
      return 1;
  }
}

export function mapNumberToComplexity(num: number): ComplexityEffort {
  switch (num) {
    case 1:
      return "XS";
    case 2:
      return "S";
    case 3:
      return "M";
    case 4:
      return "L";
    case 5:
      return "XL";
    default:
      return "M";
  }
}

export function mapComplexityToNumber(
  complexity: ComplexityEffort | number,
): number {
  if (typeof complexity === "number") return complexity;
  switch (complexity) {
    case "XS":
      return 1;
    case "S":
      return 2;
    case "M":
      return 3;
    case "L":
      return 4;
    case "XL":
      return 5;
    default:
      return 3;
  }
}

export function mapNumberToType(num: number): RequirementType {
  switch (num) {
    case 1:
      return "Internal";
    case 2:
      return "External";
    case 3:
      return "Client";
    default:
      return "Internal";
  }
}

export function mapTypeToNumber(type: RequirementType | number): number {
  if (typeof type === "number") return type;
  switch (type) {
    case "Internal":
      return 1;
    case "External":
      return 2;
    case "Client":
      return 3;
    default:
      return 1;
  }
}

export function mapNumberToModality(num: number): StudyModality {
  switch (num) {
    case 1:
      return "Virtual";
    case 2:
      return "Presencial";
    case 3:
      return "Virtual/Presencial";
    default:
      return "Virtual";
  }
}

export function mapModalityToNumber(modality: StudyModality | number): number {
  if (typeof modality === "number") return modality;
  switch (modality) {
    case "Virtual":
      return 1;
    case "Presencial":
      return 2;
    case "Virtual/Presencial":
      return 3;
    default:
      return 1;
  }
}

export function mapNumberToImpactLevel(num: number): UserImpactLevel {
  switch (num) {
    case 1:
      return "Low";
    case 2:
      return "Medium";
    case 3:
      return "High";
    case 4:
      return "Very High";
    default:
      return "Low";
  }
}

export function mapImpactLevelToNumber(
  level: UserImpactLevel | number,
): number {
  if (typeof level === "number") return level;
  switch (level) {
    case "Low":
      return 1;
    case "Medium":
      return 2;
    case "High":
      return 3;
    case "Very High":
      return 4;
    default:
      return 1;
  }
}

export function mapBackendToListItem(
  row: BackendEnrichedRequirement,
): RequirementListItem {
  const requestingInstitution = (row.requesting_institution_name ??
    row.requesting_institution?.name ??
    "FUNIBER") as RequestingInstitution;

  const domain = (row.domain_in_charge_name ??
    row.domain_in_charge?.name ??
    "Financiero") as DomainArea;

  const requestedByList = Array.isArray(row.requested_by)
    ? row.requested_by
    : row.requested_by
      ? [String(row.requested_by)]
      : [];

  const requestedBy = requestedByList.join(", ");

  const collaboratorDomains = (row.domains_collaborators ?? []) as DomainArea[];
  const followerDomains = (row.followers_domains ?? []) as DomainArea[];
  const benefitedInstitutions = (row.benefited_institutions ??
    []) as BenefitedInstitution[];

  const modalityStr = mapNumberToModality(row.study_modality);
  const modalities: StudyModality[] =
    modalityStr === "Virtual/Presencial"
      ? ["Virtual", "Presencial"]
      : [modalityStr];

  const startDate = row.start_date
    ? new Date(row.start_date).toISOString().split("T")[0]
    : null;

  const finishDate = row.end_date
    ? new Date(row.end_date).toISOString().split("T")[0]
    : null;

  return {
    id: row.uuid || String(row.id),
    numericId: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    requestingInstitution,
    requestingInstitutionId: row.requesting_institution_id,
    requestedBy,
    requestedByList,
    domain,
    domainId: row.domain_in_charge_id,
    collaboratorDomains,
    followerDomains,
    benefitedInstitutions,
    totalBenefitedInstitutions:
      row.total_benefited_institutions ?? benefitedInstitutions.length,
    isObligatory: Boolean(row.obligation),
    hasAlternativeSolution: Boolean(row.exist_solution_alternative),
    studyModalities: modalities,
    studyModalityId: row.study_modality,
    impactUsers: mapNumberToImpactLevel(row.impact_number_users_id),
    impactUsersId: row.impact_number_users_id,
    impact: row.impact,
    complexityEffort: mapNumberToComplexity(row.complexity_and_effort),
    complexityEffortId: row.complexity_and_effort,
    clientPriority: mapNumberToClientPriority(row.client_priority),
    clientPriorityId: row.client_priority,
    managementPriority: mapNumberToManagementPriority(row.management_priority),
    managementPriorityId: row.management_priority ?? 1,
    state: mapNumberToState(row.status),
    stateId: row.status,
    type: mapNumberToType(row.type),
    typeId: row.type,
    developmentTimeInSprints: row.development_time_in_sprints,
    startDate,
    finishDate,
    createdAt: row.created_at
      ? new Date(row.created_at).toISOString()
      : new Date().toISOString(),
    updatedAt: row.updated_at
      ? new Date(row.updated_at).toISOString()
      : new Date().toISOString(),
  };
}
