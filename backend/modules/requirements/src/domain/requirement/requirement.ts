import { randomUUID } from 'node:crypto';

import { Command } from '@modules/shared/domain/common/command';
import { Event } from '@modules/shared/domain/common/event';

import { BenefitedInstitution } from './enums/benefited-institution.enum';
import { ClientPriority } from './enums/client-priority.enum';
import { ComplexityEffort } from './enums/complexity-effort.enum';
import { DomainArea } from './enums/domain-area.enum';
import { ManagementPriority } from './enums/management-priority.enum';
import { RequirementState } from './enums/requirement-state.enum';
import { RequirementType } from './enums/requirement-type.enum';
import { RequestingInstitution } from './enums/requesting-institution.enum';
import { StudyModality } from './enums/study-modality.enum';
import { UserImpactLevel } from './enums/user-impact-level.enum';

import { RequirementRegisteredEvent } from './event/requirement-registered.event';

import { CreateRequirementInterface } from './interfaces/requirement';

import {
  InvalidClientPriority,
  InvalidRequirement,
} from './exceptions/exceptions';

const MESSAGES = Symbol('messages');

export class Requirement {
  [MESSAGES]: Array<Event | Command> = [];

  private get messages(): Array<Event | Command> {
    if (!this[MESSAGES]) {
      this[MESSAGES] = [];
    }

    return this[MESSAGES];
  }

  id!: string;
  code!: number;

  name!: string;
  description!: string;

  requesting_institution!: RequestingInstitution;

  requested_by!: string;

  benefited_institutions: BenefitedInstitution[];
  total_benefited_institutions: number;

  obligation!: boolean;
  exist_solution_alternative!: boolean;

  study_modality: StudyModality[];

  impact_number_users!: UserImpactLevel;
  impact!: number;

  complexity_and_effort!: ComplexityEffort;

  client_priority!: ClientPriority;
  management_priority!: ManagementPriority;

  domain_in_charge!: DomainArea;

  domains_collaborators: DomainArea[];
  followers_domains: DomainArea[];

  state!: RequirementState;

  start_date: Date | null;
  finish_date: Date | null;

  type!: RequirementType;

  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = randomUUID();

    this.benefited_institutions = [];
    this.domains_collaborators = [];
    this.followers_domains = [];
    this.study_modality = [];

    this.total_benefited_institutions = 0;

    this.start_date = null;
    this.finish_date = null;

    this.created_at = new Date();
    this.updated_at = new Date();
  }

  static create({
    code,
    name,
    description,
    requesting_institution,
    requested_by,
    benefited_institutions,
    obligation,
    exist_solution_alternative,
    study_modality,
    impact_number_users,
    impact_number_users_value,
    complexity_and_effort,
    client_priority,
    management_priority = ManagementPriority.UNDER,
    domain_in_charge,
    domains_collaborators = [],
    followers_domains = [],
    state = RequirementState.REGISTERED,
    start_date = null,
    finish_date = null,
    type,
  }: CreateRequirementInterface): Requirement {
    Requirement.validateCreation({
      name,
      description,
      requested_by,
      benefited_institutions,
      study_modality,
      start_date,
      finish_date,
    });

    const requirement = new Requirement();

    requirement.code = code;

    requirement.name = name;
    requirement.description = description;

    requirement.requesting_institution = requesting_institution;

    requirement.requested_by = requested_by;

    requirement.benefited_institutions = [...benefited_institutions];

    requirement.total_benefited_institutions = benefited_institutions.length;

    requirement.obligation = obligation;

    requirement.exist_solution_alternative = exist_solution_alternative;

    requirement.study_modality = [...study_modality];

    requirement.impact_number_users = impact_number_users;

    requirement.complexity_and_effort = complexity_and_effort;

    requirement.management_priority = management_priority;

    requirement.domain_in_charge = domain_in_charge;

    requirement.domains_collaborators = [...domains_collaborators];

    requirement.followers_domains = [...followers_domains];

    requirement.state = state;

    requirement.start_date = start_date;
    requirement.finish_date = finish_date;

    requirement.type = type;

    /*
     * The SRS does not define the numeric mapping
     * between User Impact and its numeric contribution.
     * Therefore, the resolved numeric value is supplied
     * to the aggregate.
     */
    requirement.impact = requirement.calculateImpact(impact_number_users_value);

    requirement.client_priority =
      client_priority ?? requirement.calculateClientPriority();

    requirement.created_at = new Date();
    requirement.updated_at = new Date();

    requirement.messages.push(new RequirementRegisteredEvent(requirement));

    return requirement;
  }

  private calculateImpact(impact_number_users_value: number): number {
    const obligationValue = this.obligation ? 8 : 0;

    const alternativeSolutionValue = this.exist_solution_alternative ? 0 : 8;

    return (
      this.total_benefited_institutions +
      obligationValue +
      alternativeSolutionValue +
      impact_number_users_value
    );
  }

  private calculateClientPriority(): ClientPriority {
    if (this.impact > 0 && this.impact < 10) {
      return ClientPriority.LOW;
    }

    if (this.impact > 10 && this.impact < 20) {
      return ClientPriority.MEDIUM;
    }

    if (this.impact > 20) {
      return ClientPriority.HIGH;
    }

    throw new InvalidClientPriority(
      `Client priority cannot be calculated for impact ${this.impact}.`,
    );
  }

  adjustClientPriority(clientPriority: ClientPriority): void {
    this.client_priority = clientPriority;
    this.updated_at = new Date();
  }

  setManagementPriority(managementPriority: ManagementPriority): void {
    this.management_priority = managementPriority;
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
    study_modality,
    start_date,
    finish_date,
  }: Pick<
    CreateRequirementInterface,
    | 'name'
    | 'description'
    | 'requested_by'
    | 'benefited_institutions'
    | 'study_modality'
    | 'start_date'
    | 'finish_date'
  >): void {
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

    if (!requested_by?.trim()) {
      throw new InvalidRequirement('Requested by is required.');
    }

    if (!benefited_institutions || benefited_institutions.length === 0) {
      throw new InvalidRequirement(
        'At least one benefited institution is required.',
      );
    }

    if (!study_modality || study_modality.length === 0) {
      throw new InvalidRequirement('At least one study modality is required.');
    }

    Requirement.validateDates(start_date, finish_date);
  }

  private static validateDates(
    startDate?: Date | null,
    finishDate?: Date | null,
  ): void {
    if (!startDate || !finishDate) {
      return;
    }

    if (finishDate < startDate) {
      throw new InvalidRequirement(
        'Finish date cannot be earlier than start date.',
      );
    }
  }
}
