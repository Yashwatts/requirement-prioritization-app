import { randomUUID } from 'node:crypto';
import { RequirementCode } from '../../../../shared/domain/value-objects/requirement';
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

  private static validateCreation(
    requirementData: Pick<
      CreateRequirementInterface,
      | 'name'
      | 'description'
      | 'requested_by'
      | 'benefited_institutions'
      | 'start_date'
      | 'end_date'
    >,
  ): void {
    if (!requirementData.name?.trim()) {
      throw new InvalidRequirement('Requirement name is required.');
    }

    if (!requirementData.description?.trim()) {
      throw new InvalidRequirement('Requirement description is required.');
    }

    if (requirementData.description.length > 500) {
      throw new InvalidRequirement(
        'Requirement description cannot exceed 500 characters.',
      );
    }

    if (
      !requirementData.requested_by ||
      requirementData.requested_by.length === 0
    ) {
      throw new InvalidRequirement('Requested by is required.');
    }

    if (
      !requirementData.benefited_institutions ||
      requirementData.benefited_institutions.length === 0
    ) {
      throw new InvalidRequirement(
        'At least one benefited institution is required.',
      );
    }

    Requirement.validateDates(
      requirementData.start_date,
      requirementData.end_date,
    );
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

  static create(requirementData: CreateRequirementInterface): Requirement {
    Requirement.validateCreation(requirementData);

    const requirement = new Requirement();

    requirement.code = (
      requirementData.code !== undefined
        ? RequirementCode.from(requirementData.code)
        : RequirementCode.generate()
    ).getValue();
    requirement.name = requirementData.name;
    requirement.description = requirementData.description;
    requirement.requestingInstitutionId =
      requirementData.requesting_institution_id;
    requirement.requestedBy = [...requirementData.requested_by];
    requirement.benefitedInstitutions = [
      ...requirementData.benefited_institutions,
    ];
    requirement.totalBenefitedInstitutions =
      requirementData.benefited_institutions.length;
    requirement.obligation = requirementData.obligation;
    requirement.existSolutionAlternative =
      requirementData.exist_solution_alternative;
    requirement.studyModality = requirementData.study_modality;
    requirement.impactNumberUsersId = requirementData.impact_number_users_id;
    requirement.complexityAndEffort = requirementData.complexity_and_effort;
    requirement.domainInChargeId = requirementData.domain_in_charge_id;
    requirement.domainsCollaborators = [
      ...(requirementData.domains_collaborators || []),
    ];
    requirement.followersDomains = [
      ...(requirementData.followers_domains || []),
    ];
    requirement.status = requirementData.status || RequirementState.REGISTERED;
    requirement.developmentTimeInSprints =
      requirementData.development_time_in_sprints ?? null;
    requirement.startDate = requirementData.start_date ?? null;
    requirement.endDate = requirementData.end_date ?? null;
    requirement.type = requirementData.type;
    requirement.impact = requirementData.impact;
    requirement.clientPriority = requirementData.client_priority;

    return requirement;
  }

  modifyClientPriority(clientPriority: ClientPriority): void {
    this.clientPriority = clientPriority;
    this.updatedAt = new Date();
  }
}
