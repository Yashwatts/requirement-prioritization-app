import { Module } from '@nestjs/common';
import { SetManagementPriorityController } from './set-management-priority.controller';
import { SetManagementPriorityHandler } from './set-management-priority.handler';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { RequirementOutboxMessageRepository } from '../../infrastructure/repositories/requirement-outbox-message.repository';
import { MessageDestinationRegistry } from '@modules/shared/infrastructure/message-bus/message-destination-registry';

@Module({
  controllers: [SetManagementPriorityController],
  providers: [
    SetManagementPriorityHandler,
    RequirementRepository,
    RequirementOutboxMessageRepository,
    MessageDestinationRegistry,
  ],
})
export class SetManagementPriorityModule {}
