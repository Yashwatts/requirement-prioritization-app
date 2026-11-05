import { EntitySchema } from '@mikro-orm/core';
import { ImpactUsers } from '@modules/requirements/src/domain/requirement/impact-users/impact-users';
import { UserImpactLevelType } from '../types/user-impact-level.type';

export const ImpactUsersEntity = new EntitySchema<ImpactUsers>({
  class: ImpactUsers,
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
      type: UserImpactLevelType,
      columnType: 'smallint',
    },
    quantity: {
      type: 'json',
    },
  },
});
