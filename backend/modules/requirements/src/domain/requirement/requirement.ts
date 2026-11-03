import { randomUUID } from 'node:crypto';
import { ClientPriority } from './enums/client-priority.enum';
import { ComplexityEffort } from './enums/complexity-effort.enum';
import { RequirementState } from './enums/requirement-state.enum';
import { RequirementType } from './enums/requirement-type.enum';
import { StudyModality } from './enums/study-modality.enum';
import { InvalidRequirement } from './exceptions/exceptions';
import { CreateRequirementInterface } from './interfaces/requirement';

export class Requirement {
  id!: number;
  uuid: string;
  code!: number;
  status: RequirementState;
  name!: string;
  description!: string;
  requesting_institution_id!: number;
  requested_by: string[];
  benefited_institutions: string[];
  total_benefited_institutions: number;
  obligation!: boolean;
  exist_solution_alternative!: boolean;
  study_modality!: StudyModality;
  impact_number_users_id!: number;
  impact!: number;
  complexity_and_effort!: ComplexityEffort;
  client_priority!: ClientPriority;
  domain_in_charge_id!: number;
  domains_collaborators: string[];
  followers_domains: string[];
  development_time_in_sprints: number | null;
  start_date: Date | null;
  end_date: Date | null;
  type!: RequirementType;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.uuid = randomUUID();
    this.status = RequirementState.REGISTERED;
    this.requested_by = [];
    this.benefited_institutions = [];
    this.domains_collaborators = [];
    this.followers_domains = [];
    this.total_benefited_institutions = 0;
    this.development_time_in_sprints = null;
    this.start_date = null;
    this.end_date = null;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  static create({
    name,
    description,
    requesting_institution_id,
    requested_by,
    benefited_institutions,
    obligation,
    exist_solution_alternative,
    study_modality,
    impact_number_users_id,
    user_impact_range,
    impact_users_value,
    complexity_and_effort,
    client_priority,
    domain_in_charge_id,
    domains_collaborators = [],
    followers_domains = [],
    status = RequirementState.REGISTERED,
    development_time_in_sprints = null,
    start_date = null,
    end_date = null,
    type,
  }: CreateRequirementInterface): Requirement {
    Requirement.validateCreation({
      name,
      description,
      requested_by,
      benefited_institutions,
      start_date,
      end_date,
    });

    const requirement = new Requirement();

    requirement.code = Math.floor(100000 + Math.random() * 900000);
    requirement.name = name;
    requirement.description = description;
    requirement.requesting_institution_id = requesting_institution_id;
    requirement.requested_by = [...requested_by];
    requirement.benefited_institutions = [...benefited_institutions];
    requirement.total_benefited_institutions = benefited_institutions.length;
    requirement.obligation = obligation;
    requirement.exist_solution_alternative = exist_solution_alternative;
    requirement.study_modality = study_modality;
    requirement.impact_number_users_id = impact_number_users_id;
    requirement.complexity_and_effort = complexity_and_effort;
    requirement.domain_in_charge_id = domain_in_charge_id;
    requirement.domains_collaborators = [...domains_collaborators];
    requirement.followers_domains = [...followers_domains];
    requirement.status = status;
    requirement.development_time_in_sprints = development_time_in_sprints;
    requirement.start_date = start_date;
    requirement.end_date = end_date;
    requirement.type = type;

    const userImpact =
      user_impact_range?.getAverageQuantity() ??
      impact_users_value ??
      impact_number_users_id;
    requirement.impact = requirement.calculateImpact(userImpact);
    requirement.client_priority =
      client_priority ?? requirement.calculateClientPriority();
    requirement.created_at = new Date();
    requirement.updated_at = new Date();

    return requirement;
  }

  public static calculateImpactValue(params: {
    total_benefited_institutions: number;
    obligation: boolean;
    exist_solution_alternative: boolean;
    user_impact_value: number;
  }): number {
    const obligationValue = params.obligation ? 8 : 0;
    const alternativeSolutionValue = params.exist_solution_alternative ? 0 : 8;

    return (
      params.total_benefited_institutions +
      obligationValue +
      alternativeSolutionValue +
      params.user_impact_value
    );
  }

  public static calculateClientPriorityFromImpact(
    impact: number,
  ): ClientPriority {
    if (impact <= 10) {
      return ClientPriority.LOW;
    }

    if (impact <= 20) {
      return ClientPriority.MEDIUM;
    }

    return ClientPriority.HIGH;
  }

  private calculateImpact(impact_users_value: number): number {
    return Requirement.calculateImpactValue({
      total_benefited_institutions: this.total_benefited_institutions,
      obligation: this.obligation,
      exist_solution_alternative: this.exist_solution_alternative,
      user_impact_value: impact_users_value,
    });
  }

  private calculateClientPriority(): ClientPriority {
    return Requirement.calculateClientPriorityFromImpact(this.impact);
  }

  modifyClientPriority(clientPriority: ClientPriority): void {
    this.client_priority = clientPriority;
    this.updated_at = new Date();
  }

  private static validateCreation({
    name,
    description,
    requested_by,
    benefited_institutions,
    start_date,
    end_date,
  }: {
    name: string;
    description: string;
    requested_by: string[];
    benefited_institutions: string[];
    start_date?: Date | null;
    end_date?: Date | null;
  }): void {
    if (!name?.trim()) {
      throw new InvalidRequirement('Requirement name is required.');
    }

    if (!description?.trim()) {
      throw new InvalidRequirement('Requirement description is required.');
    }

    if (description.length > 500) {
      throw new InvalidRequirement(
        'Requirement description cannot exceed 500 characters.',
      );
    }

    if (!requested_by || requested_by.length === 0) {
      throw new InvalidRequirement('Requested by is required.');
    }

    if (!benefited_institutions || benefited_institutions.length === 0) {
      throw new InvalidRequirement(
        'At least one benefited institution is required.',
      );
    }

    Requirement.validateDates(start_date, end_date);
  }

  private static validateDates(
    startDate?: Date | null,
    endDate?: Date | null,
  ): void {
    if (!startDate || !endDate) {
      return;
    }

    if (endDate < startDate) {
      throw new InvalidRequirement(
        'End date cannot be earlier than start date.',
      );
    }
  }
}
