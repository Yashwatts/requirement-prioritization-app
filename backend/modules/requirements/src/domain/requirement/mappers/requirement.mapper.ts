import { ClientPriority } from '../enums/client-priority.enum';
import { ComplexityEffort } from '../enums/complexity-effort.enum';
import { RequirementState } from '../enums/requirement-state.enum';
import { RequirementType } from '../enums/requirement-type.enum';
import { StudyModality } from '../enums/study-modality.enum';
import { UserImpactLevel } from '../enums/user-impact-level.enum';
import { RequirementDetail } from '../interfaces/requirement';

export interface RequirementTableRowDto {
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
  studyModalityId: number;
  impactUsers: string;
  impactUsersId: number;
  impact: number;
  complexityEffort: string;
  complexityEffortId: number;
  clientPriority: string;
  clientPriorityId: number;
  status: string;
  statusId: number;
  type: string;
  typeId: number;
  developmentTimeInSprints: number | null;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export function mapNumberToClientPriority(priorityCode: number): string {
  switch (priorityCode) {
    case 1:
      return 'Low';
    case 2:
      return 'Medium';
    case 3:
      return 'High';
    default:
      return 'Low';
  }
}

export function mapClientPriorityToNumber(priority: unknown): number {
  if (typeof priority === 'number') return priority;
  if (!priority) return ClientPriority.LOW;
  const normalizedPriority =
    typeof priority === 'string' ? priority.trim().toLowerCase() : '';
  switch (normalizedPriority) {
    case 'low':
      return ClientPriority.LOW;
    case 'medium':
      return ClientPriority.MEDIUM;
    case 'high':
      return ClientPriority.HIGH;
    default:
      return ClientPriority.LOW;
  }
}

export function mapNumberToStatus(statusCode: number): string {
  switch (statusCode) {
    case 1:
      return 'Registered';
    case 2:
      return 'Flow';
    default:
      return 'Registered';
  }
}

export function mapStatusToNumber(status: unknown): number {
  if (typeof status === 'number') return status;
  if (!status) return RequirementState.REGISTERED;
  const normalizedStatus =
    typeof status === 'string' ? status.trim().toLowerCase() : '';
  switch (normalizedStatus) {
    case 'registered':
      return RequirementState.REGISTERED;
    case 'flow':
      return RequirementState.FLOW;
    default:
      return RequirementState.REGISTERED;
  }
}

export function mapNumberToComplexity(complexityCode: number): string {
  switch (complexityCode) {
    case 1:
      return 'XS';
    case 2:
      return 'S';
    case 3:
      return 'M';
    case 4:
      return 'L';
    case 5:
      return 'XL';
    default:
      return 'M';
  }
}

export function mapComplexityToNumber(complexity: unknown): number {
  if (typeof complexity === 'number') return complexity;
  if (!complexity) return ComplexityEffort.M;
  const normalizedComplexity =
    typeof complexity === 'string' ? complexity.trim().toUpperCase() : '';
  switch (normalizedComplexity) {
    case 'XS':
      return ComplexityEffort.XS;
    case 'S':
      return ComplexityEffort.S;
    case 'M':
      return ComplexityEffort.M;
    case 'L':
      return ComplexityEffort.L;
    case 'XL':
      return ComplexityEffort.XL;
    default:
      return ComplexityEffort.M;
  }
}

export function mapNumberToType(typeCode: number): string {
  switch (typeCode) {
    case 1:
      return 'Internal';
    case 2:
      return 'External';
    case 3:
      return 'Client';
    default:
      return 'Internal';
  }
}

export function mapTypeToNumber(type: unknown): number {
  if (typeof type === 'number') return type;
  if (!type) return RequirementType.INTERNAL;
  const normalizedType =
    typeof type === 'string' ? type.trim().toLowerCase() : '';
  switch (normalizedType) {
    case 'internal':
      return RequirementType.INTERNAL;
    case 'external':
      return RequirementType.EXTERNAL;
    case 'client':
      return RequirementType.CLIENT;
    default:
      return RequirementType.INTERNAL;
  }
}

export function mapNumberToModality(modalityCode: number): string {
  switch (modalityCode) {
    case 1:
      return 'Virtual';
    case 2:
      return 'Presencial';
    case 3:
      return 'Virtual/Presencial';
    default:
      return 'Virtual';
  }
}

export function mapModalityToNumber(modality: unknown): number {
  if (typeof modality === 'number') return modality;
  if (!modality) return StudyModality.VIRTUAL;

  if (Array.isArray(modality)) {
    const hasVirtual = modality.some(
      (modalityOption) =>
        typeof modalityOption === 'string' &&
        modalityOption.toLowerCase().includes('virtual'),
    );
    const hasPresencial = modality.some(
      (modalityOption) =>
        typeof modalityOption === 'string' &&
        modalityOption.toLowerCase().includes('presencial'),
    );
    if (hasVirtual && hasPresencial) {
      return StudyModality.VIRTUAL_PRESENCIAL;
    }
    if (hasPresencial) {
      return StudyModality.PRESENCIAL;
    }
    return StudyModality.VIRTUAL;
  }

  const normalizedModality =
    typeof modality === 'string' ? modality.trim().toLowerCase() : '';
  if (
    normalizedModality.includes('virtual') &&
    normalizedModality.includes('presencial')
  ) {
    return StudyModality.VIRTUAL_PRESENCIAL;
  }
  if (normalizedModality === 'presencial') {
    return StudyModality.PRESENCIAL;
  }
  return StudyModality.VIRTUAL;
}

export function mapNumberToImpactLevel(impactLevelCode: number): string {
  switch (impactLevelCode) {
    case 1:
      return 'Low';
    case 2:
      return 'Medium';
    case 3:
      return 'High';
    case 4:
      return 'Very High';
    default:
      return 'Low';
  }
}

export function mapImpactLevelToNumber(level: unknown): number {
  if (typeof level === 'number') return level;
  if (!level) return UserImpactLevel.LOW;
  if (typeof level === 'string') {
    const trimmed = level.trim();
    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
    const normalizedImpactLevel = trimmed.toLowerCase();
    if (
      normalizedImpactLevel.startsWith('very high') ||
      normalizedImpactLevel.includes('very high')
    ) {
      return UserImpactLevel.VERY_HIGH;
    }
    if (
      normalizedImpactLevel.startsWith('high') ||
      normalizedImpactLevel.includes('high')
    ) {
      return UserImpactLevel.HIGH;
    }
    if (
      normalizedImpactLevel.startsWith('medium') ||
      normalizedImpactLevel.includes('medium')
    ) {
      return UserImpactLevel.MEDIUM;
    }
    if (
      normalizedImpactLevel.startsWith('low') ||
      normalizedImpactLevel.includes('low')
    ) {
      return UserImpactLevel.LOW;
    }
  }
  return UserImpactLevel.LOW;
}

export function toRequirementTableRow(
  backendRequirement: RequirementDetail,
): RequirementTableRowDto {
  const requestingInstitution =
    backendRequirement.requesting_institution_name ??
    backendRequirement.requesting_institution?.name ??
    'FUNIBER';

  const domain =
    backendRequirement.domain_in_charge_name ??
    backendRequirement.domain_in_charge?.name ??
    'Financiero';

  const requestedByList = Array.isArray(backendRequirement.requested_by)
    ? backendRequirement.requested_by
    : backendRequirement.requested_by
      ? [String(backendRequirement.requested_by)]
      : [];

  const requestedBy = requestedByList.join(', ');

  const collaboratorDomains = backendRequirement.domains_collaborators ?? [];
  const followerDomains = backendRequirement.followers_domains ?? [];
  const benefitedInstitutions = backendRequirement.benefited_institutions ?? [];

  const studyModalityName = mapNumberToModality(
    backendRequirement.study_modality,
  );
  const studyModalities =
    studyModalityName === 'Virtual/Presencial'
      ? ['Virtual', 'Presencial']
      : [studyModalityName];

  const startDate = backendRequirement.start_date
    ? new Date(backendRequirement.start_date).toISOString().split('T')[0]
    : null;

  const finishDate = backendRequirement.end_date
    ? new Date(backendRequirement.end_date).toISOString().split('T')[0]
    : null;

  return {
    id: backendRequirement.uuid
      ? backendRequirement.uuid
      : String(backendRequirement.id),
    numericId: backendRequirement.id,
    code: backendRequirement.code,
    name: backendRequirement.name,
    description: backendRequirement.description,
    requestingInstitution,
    requestingInstitutionId: backendRequirement.requesting_institution_id,
    requestedBy,
    requestedByList,
    domain,
    domainId: backendRequirement.domain_in_charge_id,
    collaboratorDomains,
    followerDomains,
    benefitedInstitutions,
    totalBenefitedInstitutions:
      backendRequirement.total_benefited_institutions ??
      benefitedInstitutions.length,
    isObligatory: Boolean(backendRequirement.obligation),
    hasAlternativeSolution: Boolean(
      backendRequirement.exist_solution_alternative,
    ),
    studyModalities,
    studyModalityId: backendRequirement.study_modality,
    impactUsers: mapNumberToImpactLevel(
      backendRequirement.impact_number_users_id,
    ),
    impactUsersId: backendRequirement.impact_number_users_id,
    impact: backendRequirement.impact,
    complexityEffort: mapNumberToComplexity(
      backendRequirement.complexity_and_effort,
    ),
    complexityEffortId: backendRequirement.complexity_and_effort,
    clientPriority: mapNumberToClientPriority(
      backendRequirement.client_priority,
    ),
    clientPriorityId: backendRequirement.client_priority,
    status: mapNumberToStatus(backendRequirement.status),
    statusId: backendRequirement.status,
    type: mapNumberToType(backendRequirement.type),
    typeId: backendRequirement.type,
    developmentTimeInSprints:
      backendRequirement.development_time_in_sprints ?? null,
    startDate,
    finishDate,
    createdAt: backendRequirement.created_at
      ? new Date(backendRequirement.created_at).toISOString()
      : new Date().toISOString(),
    updatedAt: backendRequirement.updated_at
      ? new Date(backendRequirement.updated_at).toISOString()
      : new Date().toISOString(),
  };
}
