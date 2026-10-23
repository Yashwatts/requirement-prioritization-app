import { RequirementsMigration } from '../migration.base';

export class CreateDomains20261022000003 extends RequirementsMigration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "${this.schema}"."domains" (
        "id"           serial       not null,
        "uuid"         uuid         not null default gen_random_uuid(),
        "abbreviation" varchar(50)  not null,
        "name"         varchar(250) not null,
        "translations" jsonb        null,
        "email"        varchar(250) null,
        constraint "domains_pkey"        primary key ("id"),
        constraint "domains_uuid_unique" unique      ("uuid")
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "${this.schema}"."domains" cascade;`);
  }
}
