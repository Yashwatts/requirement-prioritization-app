import { Migration } from '@mikro-orm/migrations';

/**
 * Base class for all Requirements module migrations.
 * Provides a typed `schema` property so every migration
 * reads from the same env-var instead of hard-coding the
 * schema name.
 */
export abstract class RequirementsMigration extends Migration {
  protected readonly schema: string =
    process.env.DB_REQUIREMENTS_SCHEMA ?? 'requirements';
}
