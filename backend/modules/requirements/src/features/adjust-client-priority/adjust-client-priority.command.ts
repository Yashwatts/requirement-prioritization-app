import { ICommand } from '@nestjs/cqrs';
import { ClientPriority } from '../../domain/types';

export class AdjustClientPriorityCommand implements ICommand {
  constructor(
    public readonly requirementId: string,
    public readonly newClientPriority: ClientPriority,
  ) {}
}
