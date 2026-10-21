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
} from '../../domain/requirement/types';

export interface RequirementDetailViewModel {
  id: string;
  code: number;
  name: string;
  description: string;
  requestingInstitution: RequestingInstitution;
  requestedBy: string;
  type: RequirementType;
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
  startDate: Date | null;
  finishDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
