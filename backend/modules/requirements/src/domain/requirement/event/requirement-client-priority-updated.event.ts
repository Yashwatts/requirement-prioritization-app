import { Requirement } from '../requirement';
import { Event } from 'modules/shared/domain/common/event';

interface RequirementClientPriorityUpdatedPayload {
  requirement: Requirement;
  previous_priority: string;
}

export class RequirementClientPriorityUpdatedEvent extends Event<RequirementClientPriorityUpdatedPayload> {
  type = 'requirement-prioritization.requirement_client_priority_updated';

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
        client_priority: requirement.client_priority,
      },
      previous_priority,
    };
  }
}
