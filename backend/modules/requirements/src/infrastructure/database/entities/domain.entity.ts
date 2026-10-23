import { EntitySchema } from '@mikro-orm/core';
import { DomainArea } from '@modules/requirements/src/domain/domain-area/domain-area';

export const DomainEntity = new EntitySchema<DomainArea>({
  class: DomainArea,
  tableName: 'domains',
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
    abbreviation: {
      type: 'varchar',
      length: 50,
    },
    name: {
      type: 'varchar',
      length: 250,
    },
    translations: {
      type: 'json',
      nullable: true,
    },
    email: {
      type: 'varchar',
      length: 250,
      nullable: true,
    },
  },
});
