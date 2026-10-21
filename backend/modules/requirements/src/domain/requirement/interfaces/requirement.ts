import { BenefitedInstitution } from '../enums/benefited-institution.enum';
import { ClientPriority } from '../enums/client-priority.enum';
import { ComplexityEffort } from '../enums/complexity-effort.enum';
import { DomainArea } from '../enums/domain-area.enum';
import { ManagementPriority } from '../enums/management-priority.enum';
import { RequirementState } from '../enums/requirement-state.enum';
import { RequirementType } from '../enums/requirement-type.enum';
import { RequestingInstitution } from '../enums/requesting-institution.enum';
import { StudyModality } from '../enums/study-modality.enum';
import { UserImpactLevel } from '../enums/user-impact-level.enum';

export interface CreateRequirementInterface {
  code: number;
  name: string;
  description: string;
  requesting_institution: RequestingInstitution;
  requested_by: string;
  benefited_institutions: BenefitedInstitution[];
  obligation: boolean;
  exist_solution_alternative: boolean;
  study_modality: StudyModality[];
  impact_number_users: UserImpactLevel;
  impact_number_users_value: number;
  complexity_and_effort: ComplexityEffort;
  client_priority?: ClientPriority;
  management_priority?: ManagementPriority;
  domain_in_charge: DomainArea;
  domains_collaborators?: DomainArea[];
  followers_domains?: DomainArea[];
  state?: RequirementState;
  start_date?: Date | null;
  finish_date?: Date | null;
  type: RequirementType;
}
