import { Injectable } from '@nestjs/common';

import { OutboxMessageRepository } from '@modules/shared/infrastructure/repository/outbox-message/outbox-message.repository';

@Injectable()
export class RequirementOutboxMessageRepository extends OutboxMessageRepository {
  protected override readonly schema = process.env.DB_REQUIREMENTS_SCHEMA;
}
