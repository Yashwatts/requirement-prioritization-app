import { EntitySchema } from '@mikro-orm/core';
import { ImpactUsersDomain } from '@modules/requirements/src/domain/impact-users-domain/impact-users-domain';

export const ImpactUsersDomainEntity = new EntitySchema<ImpactUsersDomain>({
  class: ImpactUsersDomain,
  tableName: 'impact_users_domains',
  schema: process.env.DB_REQUIREMENTS_SCHEMA,

  properties: {
    id: {
      type: 'integer',
      primary: true,
      autoincrement: true,
    },
    domain_uuid: {
      type: 'uuid',
    },
    impact_number_users_level: {
      type: 'smallint',
    },
    quantity: {
      type: 'json',
    },
  },
});
