import { Injectable } from '@nestjs/common';
import { Transactional } from '@mikro-orm/core';

import { Requirement } from '../../domain/requirement/requirement';
import { InvalidRequirement } from '../../domain/requirement/exceptions/exceptions';

import { RegisterRequirementCommand } from './register-requirement.command';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { RequirementOutboxMessageRepository } from '../../infrastructure/repositories/requirement-outbox-message.repository';
import { ImpactUsersDomainRepository } from '../../infrastructure/repositories/impact-users-domain.repository';

@Injectable()
export class RegisterRequirementHandler {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly outboxMessageRepository: RequirementOutboxMessageRepository,
    private readonly impactUsersDomainRepository: ImpactUsersDomainRepository,
  ) {}

  @Transactional()
  async handle(command: RegisterRequirementCommand): Promise<void> {
    const {
      name,
      description,
      requesting_institution_id,
      requested_by,
      benefited_institutions,
      study_modality,
      impact_number_users_id,
      obligation,
      exist_solution_alternative,
      complexity_and_effort,
      client_priority,
      management_priority,
      domain_in_charge_id,
      domains_collaborators,
      followers_domains,
      development_time_in_sprints,
      start_date,
      end_date,
      type,
    } = command.payload;

    let impactUsersValue = command.payload.impact_users_value;

    if (impactUsersValue === undefined || impactUsersValue === null) {
      const impactTier = await this.impactUsersDomainRepository.findOne({
        id: impact_number_users_id,
      });

      if (!impactTier) {
        throw new InvalidRequirement(
          `Impact users tier with id ${impact_number_users_id} not found.`,
        );
      }

      impactUsersValue = impactTier.impact_number_users_level;
    }

    const requirement = Requirement.create({
      name,
      description,
      requesting_institution_id,
      requested_by,
      benefited_institutions,
      study_modality,
      impact_number_users_id,
      impact_users_value: impactUsersValue,
      obligation,
      exist_solution_alternative,
      complexity_and_effort,
      client_priority,
      management_priority,
      domain_in_charge_id,
      domains_collaborators,
      followers_domains,
      development_time_in_sprints,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      type,
    });

    await this.requirementRepository.save(requirement);

    await this.outboxMessageRepository.storeOutboxMessages(
      requirement.getMessages(),
    );
  }
}
