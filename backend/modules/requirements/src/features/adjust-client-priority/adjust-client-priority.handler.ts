import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IRequirementRepository,
  REQUIREMENT_REPOSITORY_TOKEN,
} from '../../domain/requirement/requirement.repository.interface';
import { RequirementNotFoundException } from '../../domain/requirement/exceptions';
import { AdjustClientPriorityCommand } from './adjust-client-priority.command';

@CommandHandler(AdjustClientPriorityCommand)
export class AdjustClientPriorityHandler implements ICommandHandler<
  AdjustClientPriorityCommand,
  void
> {
  constructor(
    @Inject(REQUIREMENT_REPOSITORY_TOKEN)
    private readonly requirementRepository: IRequirementRepository,
  ) {}

  async execute(command: AdjustClientPriorityCommand): Promise<void> {
    const requirement = await this.requirementRepository.findById(
      command.requirementId,
    );
    if (!requirement) {
      throw new RequirementNotFoundException(command.requirementId);
    }

    requirement.adjustClientPriority(command.newClientPriority);
    await this.requirementRepository.save(requirement);
  }
}
