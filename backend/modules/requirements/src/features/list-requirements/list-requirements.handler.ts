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
      },
    };

    const [requirements, total] = await this.requirementRepository.findAndCount(
      criteria,
      options,
    );

    const institutionIds = Array.from(
      new Set(
        requirements
          .map((r) => r.requesting_institution_id)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );

    const domainIds = Array.from(
      new Set(
        requirements
          .map((r) => r.domain_in_charge_id)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );

    const institutions = institutionIds.length
      ? await this.institutionRepository.find({ id: { $in: institutionIds } })
      : [];

    const domains = domainIds.length
      ? await this.domainRepository.find({ id: { $in: domainIds } })
      : [];

    const institutionMap = new Map(institutions.map((i) => [i.id, i]));
    const domainMap = new Map(domains.map((d) => [d.id, d]));

    const rows: RequirementDetail[] = requirements.map((req) => {
      const institution = institutionMap.get(req.requesting_institution_id);
      const domain = domainMap.get(req.domain_in_charge_id);

      return {
        id: req.id,
        uuid: req.uuid,
        code: req.code,
        status: req.status,
        name: req.name,
        description: req.description,
        requesting_institution_id: req.requesting_institution_id,
        requesting_institution_name: institution?.name ?? null,
        requesting_institution: institution
          ? {
              id: institution.id,
              uuid: institution.uuid,
              name: institution.name,
            }
          : null,
        requested_by: req.requested_by,
        benefited_institutions: req.benefited_institutions,
        total_benefited_institutions: req.total_benefited_institutions,
        obligation: req.obligation,
        exist_solution_alternative: req.exist_solution_alternative,
        study_modality: req.study_modality,
        impact_number_users_id: req.impact_number_users_id,
        impact: req.impact,
        complexity_and_effort: req.complexity_and_effort,
        client_priority: req.client_priority,
        domain_in_charge_id: req.domain_in_charge_id,
        domain_in_charge_name: domain?.name ?? null,
        domain_in_charge: domain
          ? {
              id: domain.id,
              uuid: domain.uuid,
              name: domain.name,
              abbreviation: domain.abbreviation,
            }
          : null,
        domains_collaborators: req.domains_collaborators,
        followers_domains: req.followers_domains,
        development_time_in_sprints: req.development_time_in_sprints,
        start_date: req.start_date,
        end_date: req.end_date,
        type: req.type,
        created_at: req.created_at,
        updated_at: req.updated_at,
      };
    });

    return {
      total,
      limit,
      page,
      rows,
    };
  }
}
