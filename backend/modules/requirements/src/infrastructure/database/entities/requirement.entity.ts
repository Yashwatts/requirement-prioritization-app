import { EntitySchema } from '@mikro-orm/core';
import { Requirement } from '@modules/requirements/src/domain/requirement/requirement';
import { RequirementState } from '@modules/requirements/src/domain/requirement/enums/requirement-state.enum';
import { ClientPriorityType } from '../types/client-priority.type';
import { ComplexityEffortType } from '../types/complexity-effort.type';
import { RequirementStateType } from '../types/requirement-state.type';
import { RequirementTypeType } from '../types/requirement-type.type';
import { StudyModalityType } from '../types/study-modality.type';

export const RequirementEntity = new EntitySchema<Requirement>({
  class: Requirement,
  tableName: 'requirements',
  schema: process.env.DB_REQUIREMENTS_SCHEMA,

  properties: {
    id: {
      type: 'integer',
      primary: true,
      autoincrement: true,
    },

    uuid: {
      type: 'uuid',
      unique: true,
    },

    code: {
      type: 'integer',
      unique: true,
    },

    status: {
      type: RequirementStateType,
      columnType: 'smallint',
      default: RequirementState.REGISTERED,
    },

    benefitedInstitutions: {
      type: 'json',
      fieldName: 'benefited_institutions',
    },

    requestingInstitutionId: {
      type: 'integer',
      fieldName: 'requesting_institution_id',
    },

    name: {
      type: 'varchar',
      length: 250,
    },

    domainsCollaborators: {
      type: 'json',
      fieldName: 'domains_collaborators',
    },

    domainInChargeId: {
      type: 'integer',
      fieldName: 'domain_in_charge_id',
    },

    followersDomains: {
      type: 'json',
      fieldName: 'followers_domains',
    },

    obligation: {
      type: 'boolean',
    },

    existSolutionAlternative: {
      type: 'boolean',
      fieldName: 'exist_solution_alternative',
    },

    impactNumberUsersId: {
      type: 'integer',
      fieldName: 'impact_number_users_id',
    },

    studyModality: {
      type: StudyModalityType,
      columnType: 'smallint',
      fieldName: 'study_modality',
    },

    impact: {
      type: 'integer',
    },

    clientPriority: {
      type: ClientPriorityType,
      columnType: 'smallint',
      fieldName: 'client_priority',
    },

    requestedBy: {
      type: 'json',
      fieldName: 'requested_by',
    },

    description: {
      type: 'text',
    },

    complexityAndEffort: {
      type: ComplexityEffortType,
      columnType: 'smallint',
      fieldName: 'complexity_and_effort',
    },

    developmentTimeInSprints: {
      type: 'integer',
      fieldName: 'development_time_in_sprints',
      nullable: true,
    },

    startDate: {
      type: 'timestamp',
      fieldName: 'start_date',
      nullable: true,
    },

    endDate: {
      type: 'timestamp',
      fieldName: 'end_date',
      nullable: true,
    },

    type: {
      type: RequirementTypeType,
      columnType: 'smallint',
      fieldName: 'type',
    },

    totalBenefitedInstitutions: {
      type: 'integer',
      fieldName: 'total_benefited_institutions',
      default: 0,
    },

    createdAt: {
      type: 'timestamp',
      fieldName: 'created_at',
      onCreate: () => new Date(),
    },

    updatedAt: {
      type: 'timestamp',
      fieldName: 'updated_at',
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
    },
  },
});
