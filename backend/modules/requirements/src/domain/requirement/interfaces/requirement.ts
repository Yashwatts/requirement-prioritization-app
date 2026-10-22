import { ClientPriority } from '../enums/client-priority.enum';
import { ComplexityEffort } from '../enums/complexity-effort.enum';
import { ManagementPriority } from '../enums/management-priority.enum';
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
  impact_users_value: number;
  complexity_and_effort: ComplexityEffort;
  client_priority?: ClientPriority;
  management_priority?: ManagementPriority;
  domain_in_charge_id: number;
  domains_collaborators?: string[];
  followers_domains?: string[];
  status?: RequirementState;
  development_time_in_sprints?: number | null;
  start_date?: Date | null;
  end_date?: Date | null;
  type: RequirementType;
}

export interface UpdateRequirementInterface {
  name: string;
  description: string;
  requesting_institution_id: number;
  requested_by: string[];
  benefited_institutions: string[];
  obligation: boolean;
  exist_solution_alternative: boolean;
  study_modality: StudyModality;
  impact_number_users_id: number;
  impact_users_value?: number;
  complexity_and_effort: ComplexityEffort;
  client_priority?: ClientPriority;
  management_priority?: ManagementPriority;
  domain_in_charge_id: number;
  domains_collaborators?: string[];
  followers_domains?: string[];
  status?: RequirementState;
  development_time_in_sprints?: number | null;
  start_date?: Date | null;
  end_date?: Date | null;
  type: RequirementType;
}

export interface EnrichedRequirement {
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
  management_priority?: number;
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
  start_date: Date | null;
  end_date: Date | null;
  type: number;
  created_at: Date;
  updated_at: Date;
}

export interface ListRequirementsResult {
  total: number;
  limit: number;
  page: number;
  rows: EnrichedRequirement[];
}
