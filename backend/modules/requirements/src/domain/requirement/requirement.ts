import { randomUUID } from 'node:crypto';
import { Command } from '@modules/shared/domain/common/command';
import { Event } from '@modules/shared/domain/common/event';
import { ClientPriority } from './enums/client-priority.enum';
import { ComplexityEffort } from './enums/complexity-effort.enum';
import { ManagementPriority } from './enums/management-priority.enum';
import { RequirementState } from './enums/requirement-state.enum';
import { RequirementType } from './enums/requirement-type.enum';
import { StudyModality } from './enums/study-modality.enum';
import { RequirementRegisteredEvent } from './event/requirement-registered.event';
import { RequirementClientPriorityUpdatedEvent } from './event/requirement-client-priority-updated.event';
import { RequirementManagementPriorityUpdatedEvent } from './event/requirement-management-priority-updated.event';
import {
  CreateRequirementInterface,
  UpdateRequirementInterface,
} from './interfaces/requirement';
import { InvalidRequirement } from './exceptions/exceptions';

const MESSAGES = Symbol('messages');

export class Requirement {
  [MESSAGES]: Array<Event | Command> = [];

  private get messages(): Array<Event | Command> {
    if (!this[MESSAGES]) {
      this[MESSAGES] = [];
    }

    return this[MESSAGES];
  }

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
  management_priority?: ManagementPriority;
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
    impact_users_value,
    complexity_and_effort,
    client_priority,
    management_priority = ManagementPriority.UNDER,
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
    requirement.management_priority = management_priority;
    requirement.domain_in_charge_id = domain_in_charge_id;
    requirement.domains_collaborators = [...domains_collaborators];
    requirement.followers_domains = [...followers_domains];
    requirement.status = status;
    requirement.development_time_in_sprints = development_time_in_sprints;
    requirement.start_date = start_date;
    requirement.end_date = end_date;
    requirement.type = type;
    requirement.impact = requirement.calculateImpact(impact_users_value);
    requirement.client_priority =
      client_priority ?? requirement.calculateClientPriority();
    requirement.created_at = new Date();
    requirement.updated_at = new Date();

    requirement.messages.push(new RequirementRegisteredEvent(requirement));

    return requirement;
  }

  private calculateImpact(impact_users_value: number): number {
    const obligationValue = this.obligation ? 8 : 0;
    const alternativeSolutionValue = this.exist_solution_alternative ? 0 : 8;

    return (
      this.total_benefited_institutions +
      obligationValue +
      alternativeSolutionValue +
      impact_users_value
    );
  }

  private calculateClientPriority(): ClientPriority {
    if (this.impact <= 10) {
      return ClientPriority.LOW;
    }

    if (this.impact <= 20) {
      return ClientPriority.MEDIUM;
    }

    return ClientPriority.HIGH;
  }

  adjustClientPriority(clientPriority: ClientPriority): void {
    const previousPriority = String(this.client_priority);
    this.client_priority = clientPriority;
    this.updated_at = new Date();
    this.messages.push(
      new RequirementClientPriorityUpdatedEvent(this, previousPriority),
    );
  }

  setManagementPriority(managementPriority: ManagementPriority): void {
    const previousPriority = String(this.management_priority ?? '');
    this.management_priority = managementPriority;
    this.updated_at = new Date();
    this.messages.push(
      new RequirementManagementPriorityUpdatedEvent(this, previousPriority),
    );
  }

  update(params: UpdateRequirementInterface): void {
    Requirement.validateCreation({
      name: params.name,
      description: params.description,
      requested_by: params.requested_by,
      benefited_institutions: params.benefited_institutions,
      start_date: params.start_date,
      end_date: params.end_date,
    });

    this.name = params.name;
    this.description = params.description;
    this.requesting_institution_id = params.requesting_institution_id;
    this.requested_by = [...params.requested_by];
    this.benefited_institutions = [...params.benefited_institutions];
    this.total_benefited_institutions = params.benefited_institutions.length;
    this.obligation = params.obligation;
    this.exist_solution_alternative = params.exist_solution_alternative;
    this.study_modality = params.study_modality;
    this.impact_number_users_id = params.impact_number_users_id;
    this.complexity_and_effort = params.complexity_and_effort;
    if (params.management_priority !== undefined) {
      this.management_priority = params.management_priority;
    }
    this.domain_in_charge_id = params.domain_in_charge_id;
    if (params.domains_collaborators) {
      this.domains_collaborators = [...params.domains_collaborators];
    }
    if (params.followers_domains) {
      this.followers_domains = [...params.followers_domains];
    }
    if (params.status !== undefined) {
      this.status = params.status;
    }
    this.development_time_in_sprints =
      params.development_time_in_sprints ?? null;
    this.start_date = params.start_date ?? null;
    this.end_date = params.end_date ?? null;
    this.type = params.type;

    if (params.impact_users_value !== undefined) {
      this.impact = this.calculateImpact(params.impact_users_value);
      this.client_priority =
        params.client_priority ?? this.calculateClientPriority();
    } else if (params.client_priority !== undefined) {
      this.client_priority = params.client_priority;
    }

    this.updated_at = new Date();
  }

  getMessages(): Array<Event | Command> {
    return this[MESSAGES] ?? [];
  }

  clearMessages(): void {
    this[MESSAGES] = [];
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
