import { Event } from '@modules/shared/domain/common/event';
import { Requirement } from '../requirement';

interface RequirementManagementPriorityUpdatedPayload {
  requirement: Requirement;
  previous_priority: string;
}

export class RequirementManagementPriorityUpdatedEvent extends Event<RequirementManagementPriorityUpdatedPayload> {
  type = 'requirement-prioritization.requirement_management_priority_updated';

  constructor(requirement: Requirement, previous_priority: string) {
    super(
      {
        requirement,
        previous_priority,
      },
      process.env.APP_NAME ?? 'requirement-prioritization-app',
    );
  }

  getBody(): Record<string, unknown> {
    const { requirement, previous_priority } = this.payload;

    return {
      requirement: {
        id: requirement.id,
        uuid: requirement.uuid,
        code: requirement.code,
        name: requirement.name,
        management_priority: requirement.management_priority,
      },
      previous_priority,
    };
  }
}
