import { RequirementsMigration } from '../migration.base';

export class CreateRequirements20261022000005 extends RequirementsMigration {
  override async up(): Promise<void> {
    // Random 6-digit code — not a sequential autoincrement.
    // Application layer generates it via Math.floor(100000 + Math.random() * 900000).
    this.addSql(`
      create table if not exists "${this.schema}"."requirements" (
        "id"                           serial       not null,
        "uuid"                         uuid         not null  default gen_random_uuid(),
        "code"                         integer      not null,
        "status"                       smallint     not null  default 1,
        "benefited_institutions"       jsonb        not null  default '[]'::jsonb,
        "requesting_institution_id"    integer      not null,
        "name"                         varchar(250) not null,
        "domains_collaborators"        jsonb        not null  default '[]'::jsonb,
        "domain_in_charge_id"          integer      not null,
        "followers_domains"            jsonb        not null  default '[]'::jsonb,
        "obligation"                   boolean      not null,
        "exist_solution_alternative"   boolean      not null,
        "impact_number_users_id"       integer      not null,
        "study_modality"               smallint     not null,
        "impact"                       integer      not null,
        "client_priority"              smallint     not null,
        "requested_by"                 jsonb        not null  default '[]'::jsonb,
        "description"                  text         not null,
        "complexity_and_effort"        smallint     not null,
        "development_time_in_sprints"  integer      null,
        "start_date"                   timestamp    null,
        "end_date"                     timestamp    null,
        "type"                         smallint     not null,
        "total_benefited_institutions" integer      not null  default 0,
        "created_at"                   timestamp    not null  default now(),
        "updated_at"                   timestamp    not null  default now(),
        constraint "requirements_pkey"        primary key ("id"),
        constraint "requirements_uuid_unique" unique      ("uuid"),
        constraint "requirements_code_unique" unique      ("code"),
        constraint "fk_requirements_requesting_institution"
          foreign key ("requesting_institution_id")
          references "${this.schema}"."institutions" ("id")
          on update cascade
          on delete restrict,
        constraint "fk_requirements_domain_in_charge"
          foreign key ("domain_in_charge_id")
          references "${this.schema}"."domains" ("id")
          on update cascade
          on delete restrict,
        constraint "fk_requirements_impact_users"
          foreign key ("impact_number_users_id")
          references "${this.schema}"."impact_users_domains" ("id")
          on update cascade
          on delete restrict
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop table if exists "${this.schema}"."requirements" cascade;`,
    );
  }
}
