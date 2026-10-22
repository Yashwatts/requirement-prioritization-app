import { Module } from '@nestjs/common';

import { AdjustClientPriorityController } from './adjust-client-priority.controller';
import { AdjustClientPriorityHandler } from './adjust-client-priority.handler';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { RequirementOutboxMessageRepository } from '../../infrastructure/repositories/requirement-outbox-message.repository';
import { MessageDestinationRegistry } from '@modules/shared/infrastructure/message-bus/message-destination-registry';

@Module({
  controllers: [AdjustClientPriorityController],
  providers: [
    AdjustClientPriorityHandler,
    RequirementRepository,
    RequirementOutboxMessageRepository,
    MessageDestinationRegistry,
  ],
})
export class AdjustClientPriorityModule {}
