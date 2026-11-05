import { EntitySchema } from '@mikro-orm/core';
import { Domain } from '@modules/requirements/src/domain/requirement/domain/domain';
import { randomUUID } from 'node:crypto';

export const DomainEntity = new EntitySchema<Domain>({
  class: Domain,
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
      onCreate: () => randomUUID(),
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
