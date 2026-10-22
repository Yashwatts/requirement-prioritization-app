import { Migration } from '@mikro-orm/migrations';

export class Migration20261022065833 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "requirements";`);

    // 1. institutions table
    this.addSql(`
      create table if not exists "requirements"."institutions" (
        "id" serial not null,
        "uuid" uuid not null default gen_random_uuid(),
        "name" varchar(250) not null,
        constraint "institutions_pkey" primary key ("id"),
        constraint "institutions_uuid_unique" unique ("uuid")
      );
    `);

    // 2. domains table
    this.addSql(`
      create table if not exists "requirements"."domains" (
        "id" serial not null,
        "uuid" uuid not null default gen_random_uuid(),
        "abbreviation" varchar(50) not null,
        "name" varchar(250) not null,
        "translations" jsonb null,
        "email" varchar(250) null,
        constraint "domains_pkey" primary key ("id"),
        constraint "domains_uuid_unique" unique ("uuid")
      );
    `);

    // 3. impact_users_domains table
    this.addSql(`
      create table if not exists "requirements"."impact_users_domains" (
        "id" serial not null,
        "domain_uuid" uuid not null,
        "impact_number_users_level" smallint not null,
        "quantity" jsonb not null,
        constraint "impact_users_domains_pkey" primary key ("id"),
        constraint "fk_impact_users_domains_domain" foreign key ("domain_uuid") references "requirements"."domains" ("uuid") on update cascade on delete cascade
      );
    `);

    // 4. requirements table
    this.addSql(`
      create table if not exists "requirements"."requirements" (
        "id" serial not null,
        "uuid" uuid not null default gen_random_uuid(),
        "code" serial not null,
        "status" smallint not null default 1,
        "benefited_institutions" jsonb not null default '[]'::jsonb,
        "requesting_institution_id" int not null,
        "name" varchar(250) not null,
        "domains_collaborators" jsonb not null default '[]'::jsonb,
        "domain_in_charge_id" int not null,
        "followers_domains" jsonb not null default '[]'::jsonb,
        "obligation" boolean not null,
        "exist_solution_alternative" boolean not null,
        "impact_number_users_id" int not null,
        "study_modality" smallint not null,
        "impact" int not null,
        "client_priority" smallint not null,
        "management_priority" smallint null default 1,
        "requested_by" jsonb not null default '[]'::jsonb,
        "description" text not null,
        "complexity_and_effort" smallint not null,
        "development_time_in_sprints" int null,
        "start_date" timestamp null,
        "end_date" timestamp null,
        "type" smallint not null,
        "total_benefited_institutions" int not null default 0,
        "created_at" timestamp not null default now(),
        "updated_at" timestamp not null default now(),
        constraint "requirements_pkey" primary key ("id"),
        constraint "requirements_uuid_unique" unique ("uuid"),
        constraint "requirements_code_unique" unique ("code"),
        constraint "fk_requirements_requesting_institution" foreign key ("requesting_institution_id") references "requirements"."institutions" ("id") on update cascade on delete restrict,
        constraint "fk_requirements_domain_in_charge" foreign key ("domain_in_charge_id") references "requirements"."domains" ("id") on update cascade on delete restrict,
        constraint "fk_requirements_impact_users" foreign key ("impact_number_users_id") references "requirements"."impact_users_domains" ("id") on update cascade on delete restrict
      );
    `);

    // 5. outbox_message table
    this.addSql(`
      create table if not exists "requirements"."outbox_message" (
        "id" serial not null,
        "message_id" uuid not null default gen_random_uuid(),
        "type" varchar(255) not null,
        "body" jsonb not null,
        "status" varchar(50) not null default 'PENDING',
        "sent_at" timestamp null,
        "created_at" timestamp not null default now(),
        "updated_at" timestamp not null default now(),
        constraint "outbox_message_pkey" primary key ("id"),
        constraint "outbox_message_message_id_unique" unique ("message_id")
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop table if exists "requirements"."outbox_message" cascade;`,
    );
    this.addSql(`drop table if exists "requirements"."requirements" cascade;`);
    this.addSql(
      `drop table if exists "requirements"."impact_users_domains" cascade;`,
    );
    this.addSql(`drop table if exists "requirements"."domains" cascade;`);
    this.addSql(`drop table if exists "requirements"."institutions" cascade;`);
  }
}
