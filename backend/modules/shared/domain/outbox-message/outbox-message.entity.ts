import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export enum OutboxStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity({
  tableName: 'outbox_message',
  schema: '*',
})
export class OutboxMessage {
  @PrimaryKey()
  id!: number;

  @Property({
    type: 'uuid',
    unique: true,
  })
  message_id!: string;

  @Property({
    type: 'string',
    length: 255,
  })
  type!: string;

  @Property({
    type: 'json',
  })
  body!: Record<string, unknown>;

  @Property({
    type: 'string',
    length: 50,
    default: OutboxStatus.PENDING,
  })
  status: string = OutboxStatus.PENDING;

  @Property({
    type: 'timestamp',
    nullable: true,
  })
  sent_at!: Date | null;

  @Property({
    type: 'timestamp',
    onCreate: () => new Date(),
  })
  created_at: Date = new Date();

  @Property({
    type: 'timestamp',
    onUpdate: () => new Date(),
  })
  updated_at: Date = new Date();

  public markAsSent(): void {
    if (this.status === OutboxStatus.SENT) {
      throw new Error('Message is already marked as sent.');
    }

    this.status = OutboxStatus.SENT;
    this.sent_at = new Date();
  }

  getBody(): Record<string, unknown> {
    return this.body;
  }
}
