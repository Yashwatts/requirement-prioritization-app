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
    const isNumeric = /^\d+$/.test(id);

    const requirement = isNumeric
      ? await this.requirementRepository.findOne({
          $or: [{ id: Number(id) }, { code: Number(id) }],
        })
      : await this.requirementRepository.findOne({ uuid: id });

    if (!requirement) {
      throw new RequirementNotFound();
    }

    let impactUsersValue = data.impact_users_value;

    if (impactUsersValue === undefined || impactUsersValue === null) {
      const impactTier = await this.impactUsersDomainRepository.findOne({
        id: data.impact_number_users_id,
      });

      if (!impactTier) {
        throw new InvalidRequirement(
          `Impact users tier with id ${data.impact_number_users_id} not found.`,
        );
      }

      impactUsersValue = impactTier.impact_number_users_level;
    }

    requirement.update({
      name: data.name,
      description: data.description,
      requesting_institution_id: data.requesting_institution_id,
      requested_by: data.requested_by,
      benefited_institutions: data.benefited_institutions,
      study_modality: data.study_modality,
      impact_number_users_id: data.impact_number_users_id,
      impact_users_value: impactUsersValue,
      obligation: data.obligation,
      exist_solution_alternative: data.exist_solution_alternative,
      complexity_and_effort: data.complexity_and_effort,
      client_priority: data.client_priority,
      management_priority: data.management_priority,
      domain_in_charge_id: data.domain_in_charge_id,
      domains_collaborators: data.domains_collaborators,
      followers_domains: data.followers_domains,
      status: data.status,
      development_time_in_sprints: data.development_time_in_sprints,
      start_date: data.start_date ? new Date(data.start_date) : undefined,
      end_date: data.end_date ? new Date(data.end_date) : undefined,
      type: data.type,
    });

    await this.requirementRepository.save(requirement);
  }
}
