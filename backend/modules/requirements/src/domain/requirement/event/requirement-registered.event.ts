import { Event } from '@modules/shared/domain/common/event';
import { Requirement } from '../requirement';

interface RequirementRegisteredPayload {
  requirement: Requirement;
}

export class RequirementRegisteredEvent extends Event<RequirementRegisteredPayload> {
  type = 'requirement-prioritization.requirement_registered';

  constructor(requirement: Requirement) {
    super({ requirement }, process.env.APP_NAME!);
  }

  getBody(): Record<string, unknown> {
    const { requirement } = this.payload;

    return {
      requirement: {
        id: requirement.id,
        code: requirement.code,
        name: requirement.name,
        description: requirement.description,
        requesting_institution: requirement.requesting_institution,
        requested_by: requirement.requested_by,
        benefited_institutions: requirement.benefited_institutions,
        total_benefited_institutions: requirement.total_benefited_institutions,
        obligation: requirement.obligation,
        exist_solution_alternative: requirement.exist_solution_alternative,
        study_modality: requirement.study_modality,
        impact_number_users: requirement.impact_number_users,
        impact: requirement.impact,
        complexity_and_effort: requirement.complexity_and_effort,
        client_priority: requirement.client_priority,
        management_priority: requirement.management_priority,
        domain_in_charge: requirement.domain_in_charge,
        domains_collaborators: requirement.domains_collaborators,
        followers_domains: requirement.followers_domains,
        state: requirement.state,
        start_date: requirement.start_date ?? null,
        finish_date: requirement.finish_date,
        type: requirement.type,
      },
    };
  }
}
