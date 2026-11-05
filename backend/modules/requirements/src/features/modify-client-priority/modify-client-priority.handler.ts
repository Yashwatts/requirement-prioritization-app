import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ModifyClientPriorityCommand } from './modify-client-priority.command';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { RequirementNotFound } from '../../domain/requirement/exceptions/exceptions';

@CommandHandler(ModifyClientPriorityCommand)
export class ModifyClientPriorityHandler implements ICommandHandler<ModifyClientPriorityCommand> {
  constructor(private readonly requirementRepository: RequirementRepository) {}

  async execute(command: ModifyClientPriorityCommand): Promise<void> {
    const requirement = await this.requirementRepository.findByUuid(
      command.requirementId,
    );

    if (!requirement) {
      throw new RequirementNotFound();
    }

    requirement.modifyClientPriority(command.priorityData.client_priority);
    await this.requirementRepository.save(requirement);
  }
}
