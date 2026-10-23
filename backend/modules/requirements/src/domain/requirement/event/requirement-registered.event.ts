import { Event } from '@modules/shared/domain/common/event';
import { Requirement } from '../requirement';

interface RequirementRegisteredPayload {
  requirement: Requirement;
}

export class RequirementRegisteredEvent extends Event<RequirementRegisteredPayload> {
  type = process.env.RABBITMQ_ROUTING_KEY_REQUIREMENT_REGISTERED!;

  constructor(requirement: Requirement) {
    super({ requirement }, process.env.APP_NAME!);
  }

  getBody(): Record<string, unknown> {
    const { requirement } = this.payload;

    return {
      requirement: {
        id: requirement.id,
        uuid: requirement.uuid,
        code: requirement.code,
        name: requirement.name,
        description: requirement.description,
        requesting_institution_id: requirement.requesting_institution_id,
        requested_by: requirement.requested_by,
        benefited_institutions: requirement.benefited_institutions,
        total_benefited_institutions: requirement.total_benefited_institutions,
        obligation: requirement.obligation,
        exist_solution_alternative: requirement.exist_solution_alternative,
        study_modality: requirement.study_modality,
        impact_number_users_id: requirement.impact_number_users_id,
        impact: requirement.impact,
        complexity_and_effort: requirement.complexity_and_effort,
        client_priority: requirement.client_priority,
        management_priority: requirement.management_priority,
        domain_in_charge_id: requirement.domain_in_charge_id,
        domains_collaborators: requirement.domains_collaborators,
        followers_domains: requirement.followers_domains,
        status: requirement.status,
        development_time_in_sprints: requirement.development_time_in_sprints,
        start_date: requirement.start_date ?? null,
        end_date: requirement.end_date ?? null,
        type: requirement.type,
      },
    };
  }
}
