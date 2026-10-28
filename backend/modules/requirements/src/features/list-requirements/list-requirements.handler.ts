import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { FindOptions } from '@mikro-orm/core';
import { Requirement } from '../../domain/requirement/requirement';
import { ListRequirementsQuery } from './list-requirements.query';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import {
  ListRequirementsResult,
  RequirementDetail,
} from '../../domain/requirement/interfaces/requirement';
import { toRequirementTableRow } from '../../domain/requirement/mappers/requirement.mapper';

@QueryHandler(ListRequirementsQuery)
export class ListRequirementsHandler implements IQueryHandler<
  ListRequirementsQuery,
  ListRequirementsResult
> {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly institutionRepository: InstitutionRepository,
    private readonly domainRepository: DomainRepository,
  ) {}

  async execute(query: ListRequirementsQuery): Promise<ListRequirementsResult> {
    return this.handle(query);
  }

  async handle(query: ListRequirementsQuery): Promise<ListRequirementsResult> {
    const {
      page,
      limit,
      search,
      status,
      client_priority,
      sort_by,
      sort_order,
    } = query.params;

    const criteria: Record<string, unknown> = {
      ...(search && {
        $or: [
          {
            name: {
              $ilike: `%${search}%`,
            },
          },
          {
            description: {
              $ilike: `%${search}%`,
            },
          },
        ],
      }),

      ...(status && {
        status,
      }),

      ...(client_priority && {
        client_priority,
      }),
    };

    const VALID_SORT_COLUMNS = new Set([
      'id',
      'code',
      'name',
      'status',
      'impact',
      'client_priority',
      'complexity_and_effort',
      'domain_in_charge_id',
      'requesting_institution_id',
      'obligation',
      'exist_solution_alternative',
      'impact_number_users_id',
      'total_benefited_institutions',
      'start_date',
      'end_date',
      'type',
      'created_at',
      'updated_at',
    ]);

    const safeSortBy = VALID_SORT_COLUMNS.has(sort_by) ? sort_by : 'created_at';
    const safeSortOrder = sort_order ?? 'DESC';

    const options: FindOptions<Requirement> = {
      limit,
      offset: (page - 1) * limit,
      orderBy: {
        [safeSortBy]: safeSortOrder,
        ...(safeSortBy !== 'id' ? { id: 'DESC' } : {}),
      },
    };

    const [requirements, total] = await this.requirementRepository.findAndCount(
      criteria,
      options,
    );

    const institutionIds = Array.from(
      new Set(
        requirements
          .map((requirement) => requirement.requesting_institution_id)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );

    const domainIds = Array.from(
      new Set(
        requirements
          .map((requirement) => requirement.domain_in_charge_id)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );

    const institutions = institutionIds.length
      ? await this.institutionRepository.find({ id: { $in: institutionIds } })
      : [];

    const domains = domainIds.length
      ? await this.domainRepository.find({ id: { $in: domainIds } })
      : [];

    const institutionMap = new Map(
      institutions.map((institution) => [institution.id, institution]),
    );
    const domainMap = new Map(domains.map((domain) => [domain.id, domain]));

    const rows: RequirementDetail[] = requirements.map((requirement) => {
      const institution = institutionMap.get(
        requirement.requesting_institution_id,
      );
      const domain = domainMap.get(requirement.domain_in_charge_id);

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
    });

    const mappedRequirements = rows.map((detail) =>
      toRequirementTableRow(detail),
    );
    const totalPages =
      Math.ceil(total / limit) > 0 ? Math.ceil(total / limit) : 1;

    return {
      total,
      limit,
      page,
      totalPages,
      requirements: mappedRequirements,
      rows: mappedRequirements,
    };
  }
}
