import { Injectable } from '@nestjs/common';
import { Transactional } from '@mikro-orm/core';

import { AdjustClientPriorityCommand } from './adjust-client-priority.command';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { RequirementOutboxMessageRepository } from '../../infrastructure/repositories/requirement-outbox-message.repository';
import { RequirementNotFound } from '../../domain/requirement/exceptions/exceptions';

@Injectable()
export class AdjustClientPriorityHandler {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly outboxMessageRepository: RequirementOutboxMessageRepository,
  ) {}

  @Transactional()
  async handle(command: AdjustClientPriorityCommand): Promise<void> {
    const isNumericId =
      !isNaN(Number(command.requirementId)) &&
      Number.isInteger(Number(command.requirementId));

    const requirement = await this.requirementRepository.findOne(
      isNumericId
        ? { id: Number(command.requirementId) }
        : { uuid: command.requirementId },
    );

    if (!requirement) {
      throw new RequirementNotFound();
    }

    requirement.adjustClientPriority(command.payload.client_priority);

    await this.requirementRepository.save(requirement);

    await this.outboxMessageRepository.storeOutboxMessages(
      requirement.getMessages(),
    );
  }
}
