import { ICommand } from '@nestjs/cqrs';
import { ManagementPriority } from '../../domain/types';

export class SetManagementPriorityCommand implements ICommand {
  constructor(
    public readonly requirementId: string,
    public readonly newManagementPriority: ManagementPriority,
  ) {}
}
