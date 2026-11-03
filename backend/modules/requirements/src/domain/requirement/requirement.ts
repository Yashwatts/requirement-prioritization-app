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
  requestingInstitutionId!: number;
  requestedBy: string[];
  benefitedInstitutions: string[];
  totalBenefitedInstitutions: number;
  obligation!: boolean;
  existSolutionAlternative!: boolean;
  studyModality!: StudyModality;
  impactNumberUsersId!: number;
  impact!: number;
  complexityAndEffort!: ComplexityEffort;
  clientPriority!: ClientPriority;
  domainInChargeId!: number;
  domainsCollaborators: string[];
  followersDomains: string[];
  developmentTimeInSprints: number | null;
  startDate: Date | null;
  endDate: Date | null;
  type!: RequirementType;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.uuid = randomUUID();
    this.status = RequirementState.REGISTERED;
    this.requestedBy = [];
    this.benefitedInstitutions = [];
    this.domainsCollaborators = [];
    this.followersDomains = [];
    this.totalBenefitedInstitutions = 0;
    this.developmentTimeInSprints = null;
    this.startDate = null;
    this.endDate = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
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
    requirement.requestingInstitutionId = requesting_institution_id;
    requirement.requestedBy = [...requested_by];
    requirement.benefitedInstitutions = [...benefited_institutions];
    requirement.totalBenefitedInstitutions = benefited_institutions.length;
    requirement.obligation = obligation;
    requirement.existSolutionAlternative = exist_solution_alternative;
    requirement.studyModality = study_modality;
    requirement.impactNumberUsersId = impact_number_users_id;
    requirement.complexityAndEffort = complexity_and_effort;
    requirement.domainInChargeId = domain_in_charge_id;
    requirement.domainsCollaborators = [...domains_collaborators];
    requirement.followersDomains = [...followers_domains];
    requirement.status = status;
    requirement.developmentTimeInSprints = development_time_in_sprints;
    requirement.startDate = start_date;
    requirement.endDate = end_date;
    requirement.type = type;

    const userImpact =
      user_impact_range?.getAverageQuantity() ??
      impact_users_value ??
      impact_number_users_id;
    requirement.impact = requirement.calculateImpact(userImpact);
    requirement.clientPriority =
      client_priority ?? requirement.calculateClientPriority();
    requirement.createdAt = new Date();
    requirement.updatedAt = new Date();

    return requirement;
  }

  public static calculateImpactValue(parameters: {
    total_benefited_institutions?: number;
    totalBenefitedInstitutions?: number;
    obligation: boolean;
    exist_solution_alternative?: boolean;
    existSolutionAlternative?: boolean;
    user_impact_value?: number;
    userImpactValue?: number;
  }): number {
    const totalBenefitedInstitutions =
      parameters.totalBenefitedInstitutions ??
      parameters.total_benefited_institutions ??
      0;
    const obligationValue = parameters.obligation ? 8 : 0;
    const hasAlternativeSolution =
      parameters.existSolutionAlternative ??
      parameters.exist_solution_alternative ??
      false;
    const alternativeSolutionValue = hasAlternativeSolution ? 0 : 8;
    const userImpactValue =
      parameters.userImpactValue ?? parameters.user_impact_value ?? 0;

    return (
      totalBenefitedInstitutions +
      obligationValue +
      alternativeSolutionValue +
      userImpactValue
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

  private calculateImpact(userImpactValue: number): number {
    return Requirement.calculateImpactValue({
      totalBenefitedInstitutions: this.totalBenefitedInstitutions,
      obligation: this.obligation,
      existSolutionAlternative: this.existSolutionAlternative,
      userImpactValue: userImpactValue,
    });
  }

  private calculateClientPriority(): ClientPriority {
    return Requirement.calculateClientPriorityFromImpact(this.impact);
  }

  modifyClientPriority(clientPriority: ClientPriority): void {
    this.clientPriority = clientPriority;
    this.updatedAt = new Date();
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
