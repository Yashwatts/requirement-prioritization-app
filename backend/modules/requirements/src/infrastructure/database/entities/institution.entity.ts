import { EntitySchema } from '@mikro-orm/core';
import { Institution } from '@modules/requirements/src/domain/institution/institution';

export const InstitutionEntity = new EntitySchema<Institution>({
  class: Institution,
  tableName: 'institutions',
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
    name: {
      type: 'varchar',
      length: 250,
    },
  },
});
