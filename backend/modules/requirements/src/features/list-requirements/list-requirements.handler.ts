import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { FindOptions, QueryOrder, raw } from '@mikro-orm/core';
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
          {
            [raw('code::text')]: {
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
      'start_date',
      'end_date',
      'type',
      'created_at',
      'updated_at',
    ]);

    const safeSortBy = VALID_SORT_COLUMNS.has(sort_by) ? sort_by : 'created_at';
    const isAsc = String(sort_order ?? '')
      .toUpperCase()
      .includes('ASC');
    const safeSortOrder = isAsc
      ? QueryOrder.ASC_NULLS_FIRST
      : QueryOrder.DESC_NULLS_LAST;

    const schema = process.env.DB_REQUIREMENTS_SCHEMA ?? 'requirements';

    const ALPHABETICAL_SORT_MAP: Record<string, string> = {
      complexity_and_effort: `(CASE complexity_and_effort WHEN 1 THEN 'XS' WHEN 2 THEN 'S' WHEN 3 THEN 'M' WHEN 4 THEN 'L' WHEN 5 THEN 'XL' ELSE NULL END)`,
      client_priority: `(CASE client_priority WHEN 1 THEN 'Low' WHEN 2 THEN 'Medium' WHEN 3 THEN 'High' ELSE NULL END)`,
      status: `(CASE status WHEN 1 THEN 'Registered' WHEN 2 THEN 'Flow' ELSE NULL END)`,
      type: `(CASE type WHEN 1 THEN 'Internal' WHEN 2 THEN 'External' WHEN 3 THEN 'Client' ELSE NULL END)`,
      obligation: `(CASE obligation WHEN true THEN 'Yes' ELSE 'No' END)`,
      exist_solution_alternative: `(CASE exist_solution_alternative WHEN true THEN 'Yes' ELSE 'No' END)`,
      domain_in_charge_id: `(SELECT d.name FROM "${schema}"."domains" d WHERE d.id = domain_in_charge_id)`,
      requesting_institution_id: `(SELECT i.name FROM "${schema}"."institutions" i WHERE i.id = requesting_institution_id)`,
      impact_number_users_id: `(CASE (SELECT iud.impact_number_users_level FROM "${schema}"."impact_users_domains" iud WHERE iud.id = impact_number_users_id) WHEN 1 THEN 'Low' WHEN 2 THEN 'Medium' WHEN 3 THEN 'High' WHEN 4 THEN 'Very High' ELSE NULL END)`,
    };

    const customSortSql = ALPHABETICAL_SORT_MAP[safeSortBy];
    const sortTarget: string = customSortSql
      ? raw<Requirement, string>(customSortSql)
      : safeSortBy;

    const options: FindOptions<Requirement> = {
      limit,
      offset: (page - 1) * limit,
      orderBy: {
        [sortTarget]: safeSortOrder,
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
