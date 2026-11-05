import { ClientPriority } from '../enums/client-priority.enum';
import { ComplexityEffort } from '../enums/complexity-effort.enum';
import { RequirementState } from '../enums/requirement-state.enum';
import { RequirementType } from '../enums/requirement-type.enum';
import { StudyModality } from '../enums/study-modality.enum';

export interface CreateRequirementInterface {
  name: string;
  description: string;
  requesting_institution_id: number;
  requested_by: string[];
  benefited_institutions: string[];
  obligation: boolean;
  exist_solution_alternative: boolean;
  study_modality: StudyModality;
  impact_number_users_id: number;
  impact: number;
  code?: number;
  complexity_and_effort: ComplexityEffort;
  client_priority: ClientPriority;
  domain_in_charge_id: number;
  domains_collaborators?: string[];
  followers_domains?: string[];
  status?: RequirementState;
  development_time_in_sprints?: number | null;
  start_date?: Date | null;
  end_date?: Date | null;
  type: RequirementType;
}

export interface ListRequirementsResult {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  requirements: any[];
  rows: any[];
}
