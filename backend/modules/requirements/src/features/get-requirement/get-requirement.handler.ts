import { Injectable } from '@nestjs/common';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { RequirementNotFound } from '../../domain/requirement/exceptions/exceptions';
import { GetRequirementQuery } from './get-requirement.query';
import { EnrichedRequirement } from '../../domain/requirement/interfaces/requirement';

@Injectable()
export class GetRequirementHandler {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly institutionRepository: InstitutionRepository,
    private readonly domainRepository: DomainRepository,
  ) {}

  async handle(query: GetRequirementQuery): Promise<EnrichedRequirement> {
    const { id } = query;
    const isNumeric = /^\d+$/.test(id);

    const requirement = isNumeric
      ? await this.requirementRepository.findOne({
          $or: [{ id: Number(id) }, { code: Number(id) }],
        })
      : await this.requirementRepository.findOne({ uuid: id });

    if (!requirement) {
      throw new RequirementNotFound();
    }

    const institution = requirement.requesting_institution_id
      ? await this.institutionRepository.findOne({
          id: requirement.requesting_institution_id,
        })
      : null;

    const domain = requirement.domain_in_charge_id
      ? await this.domainRepository.findOne({
          id: requirement.domain_in_charge_id,
        })
      : null;

    return {
      id: requirement.id,
      uuid: requirement.uuid,
      code: requirement.code,
      status: requirement.status,
      name: requirement.name,
      description: requirement.description,
      requesting_institution_id: requirement.requesting_institution_id,
      requesting_institution_name: institution?.name ?? null,
      requesting_institution: institution
        ? {
            id: institution.id,
            uuid: institution.uuid,
            name: institution.name,
          }
        : null,
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
      domain_in_charge_name: domain?.name ?? null,
      domain_in_charge: domain
        ? {
            id: domain.id,
            uuid: domain.uuid,
            name: domain.name,
            abbreviation: domain.abbreviation,
          }
        : null,
      domains_collaborators: requirement.domains_collaborators,
      followers_domains: requirement.followers_domains,
      development_time_in_sprints: requirement.development_time_in_sprints,
      start_date: requirement.start_date,
      end_date: requirement.end_date,
      type: requirement.type,
      created_at: requirement.created_at,
      updated_at: requirement.updated_at,
    };
  }
}
