import { RequirementsMigration } from '../migration.base';

export class CreateOutboxMessage20261022000006 extends RequirementsMigration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "${this.schema}"."outbox_message" (
        "id"         serial       not null,
        "message_id" uuid         not null  default gen_random_uuid(),
        "type"       varchar(255) not null,
        "body"       jsonb        not null,
        "status"     varchar(50)  not null  default 'PENDING',
        "sent_at"    timestamp    null,
        "created_at" timestamp    not null  default now(),
        "updated_at" timestamp    not null  default now(),
        constraint "outbox_message_pkey"            primary key ("id"),
        constraint "outbox_message_message_id_unique" unique    ("message_id")
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop table if exists "${this.schema}"."outbox_message" cascade;`,
    );
  }
}
