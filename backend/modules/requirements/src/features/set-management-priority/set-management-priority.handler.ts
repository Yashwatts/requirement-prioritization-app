import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IRequirementRepository,
  REQUIREMENT_REPOSITORY_TOKEN,
} from '../../domain/requirement.repository.interface';
import { RequirementNotFoundException } from '../../domain/exceptions';
import { SetManagementPriorityCommand } from './set-management-priority.command';

@CommandHandler(SetManagementPriorityCommand)
export class SetManagementPriorityHandler implements ICommandHandler<
  SetManagementPriorityCommand,
  void
> {
  constructor(
    @Inject(REQUIREMENT_REPOSITORY_TOKEN)
    private readonly requirementRepository: IRequirementRepository,
  ) {}

  async execute(command: SetManagementPriorityCommand): Promise<void> {
    const requirement = await this.requirementRepository.findById(
      command.requirementId,
    );
    if (!requirement) {
      throw new RequirementNotFoundException(command.requirementId);
    }

    requirement.setManagementPriority(command.newManagementPriority);
    await this.requirementRepository.save(requirement);
  }
}
