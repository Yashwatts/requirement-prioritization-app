import { EntitySchema } from '@mikro-orm/core';
import { Requirement } from '@modules/requirements/src/domain/requirement/requirement';

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
      type: 'smallint',
      default: 1,
    },

    benefited_institutions: {
      type: 'json',
    },

    requesting_institution_id: {
      type: 'integer',
    },

    name: {
      type: 'varchar',
      length: 250,
    },

    domains_collaborators: {
      type: 'json',
    },

    domain_in_charge_id: {
      type: 'integer',
    },

    followers_domains: {
      type: 'json',
    },

    obligation: {
      type: 'boolean',
    },

    exist_solution_alternative: {
      type: 'boolean',
    },

    impact_number_users_id: {
      type: 'integer',
    },

    study_modality: {
      type: 'smallint',
    },

    impact: {
      type: 'integer',
    },

    client_priority: {
      type: 'smallint',
    },

    management_priority: {
      type: 'smallint',
      nullable: true,
    },

    requested_by: {
      type: 'json',
    },

    description: {
      type: 'text',
    },

    complexity_and_effort: {
      type: 'smallint',
    },

    development_time_in_sprints: {
      type: 'integer',
      nullable: true,
    },

    start_date: {
      type: 'timestamp',
      nullable: true,
    },

    end_date: {
      type: 'timestamp',
      nullable: true,
    },

    type: {
      type: 'smallint',
    },

    total_benefited_institutions: {
      type: 'integer',
      default: 0,
    },

    created_at: {
      type: 'timestamp',
      onCreate: () => new Date(),
    },

    updated_at: {
      type: 'timestamp',
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
    },
  },
});
