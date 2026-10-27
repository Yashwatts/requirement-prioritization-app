import { ICommand } from '@nestjs/cqrs';
import { ModifyClientPriorityValidator } from './modify-client-priority.validator';

export class ModifyClientPriorityCommand implements ICommand {
  constructor(
    public readonly requirementId: string,
    public readonly payload: ModifyClientPriorityValidator,
  ) {}
}
