import {
  BenefitedInstitution,
  ClientPriority,
  ComplexityEffort,
  DomainArea,
  ManagementPriority,
  RequestingInstitution,
  RequirementState,
  RequirementType,
  StudyModality,
  UserImpactLevel,
} from '../../domain/types';

export interface RequirementListItemViewModel {
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
  startDate: Date | null;
  finishDate: Date | null;
  createdAt: Date;
}

export interface ListRequirementsViewModel {
  items: RequirementListItemViewModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
