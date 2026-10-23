import { RequirementsMigration } from '../migration.base';

export class CreateSchema20261022000001 extends RequirementsMigration {
  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "${this.schema}";`);
  }

  override async down(): Promise<void> {
    // Intentionally left empty — dropping the schema would remove all tables.
    // If you need to drop the schema, do it manually.
  }
}
