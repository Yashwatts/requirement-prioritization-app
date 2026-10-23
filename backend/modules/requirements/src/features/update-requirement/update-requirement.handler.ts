import { Injectable } from '@nestjs/common';
import { Transactional } from '@mikro-orm/core';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { ImpactUsersDomainRepository } from '../../infrastructure/repositories/impact-users-domain.repository';
import {
  RequirementNotFound,
  InvalidRequirement,
} from '../../domain/requirement/exceptions/exceptions';
import { UpdateRequirementCommand } from './update-requirement.command';

@Injectable()
export class UpdateRequirementHandler {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly impactUsersDomainRepository: ImpactUsersDomainRepository,
  ) {}

  @Transactional()
  async handle(command: UpdateRequirementCommand): Promise<void> {
    const { id, data } = command.payload;
    const { start_date, end_date, ...requirementAttributes } = data;
    const isNumeric = /^\d+$/.test(id);

    const requirement = isNumeric
      ? await this.requirementRepository.findOne({
          $or: [{ id: Number(id) }, { code: Number(id) }],
        })
      : await this.requirementRepository.findOne({ uuid: id });

    if (!requirement) {
      throw new RequirementNotFound();
    }

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

    requirement.update({
      ...requirementAttributes,
      impact_users_value: impactUsersValue,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
    });

    await this.requirementRepository.save(requirement);
  }
}
