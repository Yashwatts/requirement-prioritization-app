import { RequirementsMigration } from '../migration.base';

export class CreateInstitutions20261022000002 extends RequirementsMigration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "${this.schema}"."institutions" (
        "id"   serial      not null,
        "uuid" uuid        not null default gen_random_uuid(),
        "name" varchar(250) not null,
        constraint "institutions_pkey"        primary key ("id"),
        constraint "institutions_uuid_unique" unique      ("uuid")
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop table if exists "${this.schema}"."institutions" cascade;`,
    );
  }
}
