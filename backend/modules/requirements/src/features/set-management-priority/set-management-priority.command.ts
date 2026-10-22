import { SetManagementPriorityValidator } from './set-management-priority.validator';

export class SetManagementPriorityCommand {
  constructor(
    public readonly requirementId: string,
    public readonly payload: SetManagementPriorityValidator,
  ) {}
}
