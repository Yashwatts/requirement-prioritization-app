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
    const { start_date, end_date, ...requirementAttributes } = command.payload;

    let impactUsersValue = requirementAttributes.impact_users_value;

    if (impactUsersValue === undefined || impactUsersValue === null) {
      const impactTier = await this.impactUsersDomainRepository.findOne({
        id: requirementAttributes.impact_number_users_id,
      });

      if (!impactTier) {
        throw new InvalidRequirement(
          `Impact users tier with id ${requirementAttributes.impact_number_users_id} not found.`,
        );
      }

      impactUsersValue = impactTier.impact_number_users_level;
    }

    const requirement = Requirement.create({
      ...requirementAttributes,
      impact_users_value: impactUsersValue,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
    });

    await this.requirementRepository.save(requirement);

    await this.outboxMessageRepository.storeOutboxMessages(
      requirement.getMessages(),
    );
  }
}
