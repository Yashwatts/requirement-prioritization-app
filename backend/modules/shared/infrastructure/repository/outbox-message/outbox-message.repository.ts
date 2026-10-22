import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { OutboxMessage, OutboxStatus } from '@modules/shared/domain/outbox-message/outbox-message.entity';
import { MessageDestinationRegistry } from '@modules/shared/infrastructure/message-bus/message-destination-registry';
import { Event } from '@modules/shared/domain/common/event';
import { Command } from '@modules/shared/domain/common/command';

@Injectable()
export class OutboxMessageRepository extends EntityRepository<OutboxMessage> {
  protected readonly schema: string | undefined = 'public';

  constructor(
    em: EntityManager,
    private readonly messageDestinationRegistry: MessageDestinationRegistry,
  ) {
    super(em, OutboxMessage);
  }

  async save(outboxMessage: Partial<OutboxMessage> | Partial<OutboxMessage>[]) {
    return this.em.persist(outboxMessage).flush();
  }

  async storeOutboxMessage(message: Event | Command) {
    const payload = this.createOutboxPayloadFromEvent(message);

    const outboxMessage = this.create(payload, {
      schema: this.schema,
      partial: true,
    });

    return this.save(outboxMessage);
  }

  async storeOutboxMessages(messages: (Event | Command)[]) {
    if (!messages.length) {
      return;
    }

    const outboxMessages = messages.map((message) => {
      const payload = this.createOutboxPayloadFromEvent(message);

      return this.create(payload, {
        schema: this.schema,
        partial: true,
      });
    });

    return this.save(outboxMessages);
  }

  private createOutboxPayloadFromEvent(
    message: Event | Command,
  ): Partial<OutboxMessage> {
    const messageType = message.getType();
    const destination = this.messageDestinationRegistry.get(messageType);
    const bodyPayload = message.getPayload();

    const body = destination
      ? { ...bodyPayload, _destination: destination }
      : bodyPayload;

    return {
      message_id: message.getId(),
      type: messageType,
      body,
      status: OutboxStatus.PENDING,
    };
  }
}
