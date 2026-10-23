import { RequirementsMigration } from '../migration.base';

export class CreateImpactUsersDomains20261022000004 extends RequirementsMigration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "${this.schema}"."impact_users_domains" (
        "id"                       serial   not null,
        "domain_uuid"              uuid     not null,
        "impact_number_users_level" smallint not null,
        "quantity"                 jsonb    not null,
        constraint "impact_users_domains_pkey" primary key ("id"),
        constraint "fk_impact_users_domains_domain"
          foreign key ("domain_uuid")
          references "${this.schema}"."domains" ("uuid")
          on update cascade
          on delete cascade
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop table if exists "${this.schema}"."impact_users_domains" cascade;`,
    );
  }
}
