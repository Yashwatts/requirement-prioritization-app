import { Migration } from '@mikro-orm/migrations';

export class Migration20261001000000_CreateRequirementsSchema extends Migration {
  override async up(): Promise<void> {
    // Create dedicated PostgreSQL schema for the Requirements module
    this.addSql(`CREATE SCHEMA IF NOT EXISTS "requirements";`);

    // Auto-incrementing sequence for human-readable requirement codes
    this.addSql(
      `CREATE SEQUENCE IF NOT EXISTS "requirements"."requirement_code_seq" START 1 INCREMENT 1;`,
    );

    // Create enums
    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE "requirements"."requesting_institution" AS ENUM (
          'FUNIBER', 'UNEATLANTICO', 'UNIC', 'UNINCOL', 'UNIB',
          'UNINI-MX', 'UNIROMANA', 'UDAS', 'Grupo Funiber', 'Proyectos Europeos'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE "requirements"."study_modality" AS ENUM (
          'Virtual', 'Presencial', 'Virtual/Presencial'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE "requirements"."user_impact_level" AS ENUM (
          'Low', 'Medium', 'High', 'Very High'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE "requirements"."complexity_effort" AS ENUM (
          'XS', 'S', 'M', 'L', 'XL'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE "requirements"."client_priority" AS ENUM (
          'Low', 'Medium', 'High'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE "requirements"."management_priority" AS ENUM (
          'Under', 'Medium', 'High', 'Discarded'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE "requirements"."domain_area" AS ENUM (
          'Financiero', 'Reincorporaciones', 'Ventas', 'Marketing Digital',
          'Administración Académica', 'Logística', 'Maquetación', 'Presencia Web',
          'Envíos Masivos', 'Docencia Académica', 'Catálogo Formativo',
          'Planificación Educativa', 'Gestión Docente', 'Acción Docente',
          'Calidad Universitaria', 'Reportería', 'ESEC', 'Proyectos Europeos'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE "requirements"."requirement_state" AS ENUM (
          'Registered', 'Flow'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE "requirements"."requirement_type" AS ENUM (
          'Internal', 'External', 'Client'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    // Main requirements table
    this.addSql(`
      CREATE TABLE "requirements"."requirements" (
        "id"                           UUID NOT NULL PRIMARY KEY,
        "code"                         INTEGER NOT NULL UNIQUE,
        "name"                         VARCHAR(255) NOT NULL,
        "description"                  VARCHAR(500) NOT NULL,
        "requesting_institution"       "requirements"."requesting_institution" NOT NULL,
        "requested_by"                 VARCHAR(255) NOT NULL,
        "benefited_institutions"       JSONB NOT NULL DEFAULT '[]',
        "total_benefited_institutions" INTEGER NOT NULL DEFAULT 0,
        "is_obligatory"                BOOLEAN NOT NULL DEFAULT FALSE,
        "has_alternative_solution"     BOOLEAN NOT NULL DEFAULT FALSE,
        "study_modalities"             JSONB NOT NULL DEFAULT '[]',
        "impact_users"                 "requirements"."user_impact_level" NOT NULL,
        "impact"                       DOUBLE PRECISION NOT NULL DEFAULT 0,
        "complexity_effort"            "requirements"."complexity_effort" NOT NULL,
        "client_priority"              "requirements"."client_priority" NOT NULL,
        "management_priority"          "requirements"."management_priority" NOT NULL DEFAULT 'Under',
        "domain"                       "requirements"."domain_area" NOT NULL,
        "collaborator_domains"         JSONB NOT NULL DEFAULT '[]',
        "follower_domains"             JSONB NOT NULL DEFAULT '[]',
        "state"                        "requirements"."requirement_state" NOT NULL DEFAULT 'Registered',
        "start_date"                   DATE,
        "finish_date"                  DATE,
        "type"                         "requirements"."requirement_type" NOT NULL,
        "created_at"                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    this.addSql(
      `CREATE INDEX "requirements_code_idx" ON "requirements"."requirements" ("code");`,
    );
    this.addSql(
      `CREATE INDEX "requirements_state_idx" ON "requirements"."requirements" ("state");`,
    );
    this.addSql(
      `CREATE INDEX "requirements_domain_idx" ON "requirements"."requirements" ("domain");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "requirements"."requirements" CASCADE;`);
    this.addSql(
      `DROP SEQUENCE IF EXISTS "requirements"."requirement_code_seq";`,
    );
    this.addSql(`DROP SCHEMA IF EXISTS "requirements" CASCADE;`);
  }
}
