import { AdjustClientPriorityValidator } from './adjust-client-priority.validator';

export class AdjustClientPriorityCommand {
  constructor(
    public readonly requirementId: string,
    public readonly payload: AdjustClientPriorityValidator,
  ) {}
}
