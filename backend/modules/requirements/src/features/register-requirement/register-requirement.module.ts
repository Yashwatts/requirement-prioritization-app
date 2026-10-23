import { Module } from '@nestjs/common';
import { MessageDestinationRegistry } from '@modules/shared/infrastructure/message-bus/message-destination-registry';
import { RegisterRequirementController } from './register-requirement.controller';
import { RegisterRequirementHandler } from './register-requirement.handler';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { RequirementOutboxMessageRepository } from '../../infrastructure/repositories/requirement-outbox-message.repository';
import { ImpactUsersDomainRepository } from '../../infrastructure/repositories/impact-users-domain.repository';

@Module({
  controllers: [RegisterRequirementController],
  providers: [
    RegisterRequirementHandler,
    RequirementRepository,
    RequirementOutboxMessageRepository,
    ImpactUsersDomainRepository,
    MessageDestinationRegistry,
  ],
})
export class RegisterRequirementModule {}
