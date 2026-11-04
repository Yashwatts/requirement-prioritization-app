import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { QueryOrder, raw } from '@mikro-orm/core';
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
            [raw('requirementTable.code::text')]: {
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
    const isAscending = String(sort_order ?? '')
      .toUpperCase()
      .includes('ASC');
    const safeSortOrder = isAscending
      ? QueryOrder.ASC_NULLS_FIRST
      : QueryOrder.DESC_NULLS_LAST;

    const databaseSchema =
      process.env.DB_REQUIREMENTS_SCHEMA ?? 'requirements';

    const queryBuilder =
      this.requirementRepository.createQueryBuilder('requirementTable');
    const knexConnection = this.requirementRepository
      .getEntityManager()
      .getKnex();

    queryBuilder.where(criteria);

    const INLINE_CASE_SORT_MAP: Record<string, string> = {
      complexity_and_effort: `(CASE requirementTable.complexity_and_effort WHEN 1 THEN 'XS' WHEN 2 THEN 'S' WHEN 3 THEN 'M' WHEN 4 THEN 'L' WHEN 5 THEN 'XL' ELSE NULL END)`,
      client_priority: `(CASE requirementTable.client_priority WHEN 1 THEN 'Low' WHEN 2 THEN 'Medium' WHEN 3 THEN 'High' ELSE NULL END)`,
      status: `(CASE requirementTable.status WHEN 1 THEN 'Registered' WHEN 2 THEN 'Flow' ELSE NULL END)`,
      type: `(CASE requirementTable.type WHEN 1 THEN 'Internal' WHEN 2 THEN 'External' WHEN 3 THEN 'Client' ELSE NULL END)`,
      obligation: `(CASE requirementTable.obligation WHEN true THEN 'Yes' ELSE 'No' END)`,
      exist_solution_alternative: `(CASE requirementTable.exist_solution_alternative WHEN true THEN 'Yes' ELSE 'No' END)`,
    };

    if (safeSortBy === 'domain_in_charge_id') {
      queryBuilder.leftJoin(
        knexConnection(`${databaseSchema}.domains`),
        'domainTable',
        {
          'domainTable.id': raw('requirementTable.domain_in_charge_id'),
        },
      );
      queryBuilder.orderBy({
        'domainTable.name': safeSortOrder,
        'requirementTable.id': 'DESC',
      });
    } else if (safeSortBy === 'requesting_institution_id') {
      queryBuilder.leftJoin(
        knexConnection(`${databaseSchema}.institutions`),
        'institutionTable',
        {
          'institutionTable.id': raw(
            'requirementTable.requesting_institution_id',
          ),
        },
      );
      queryBuilder.orderBy({
        'institutionTable.name': safeSortOrder,
        'requirementTable.id': 'DESC',
      });
    } else if (safeSortBy === 'impact_number_users_id') {
      queryBuilder.leftJoin(
        knexConnection(`${databaseSchema}.impact_users_domains`),
        'impactUsersDomainTable',
        {
          'impactUsersDomainTable.id': raw(
            'requirementTable.impact_number_users_id',
          ),
        },
      );
      queryBuilder.orderBy({
        [raw(
          "(CASE impactUsersDomainTable.impact_number_users_level WHEN 1 THEN 'Low' WHEN 2 THEN 'Medium' WHEN 3 THEN 'High' WHEN 4 THEN 'Very High' ELSE NULL END)",
        )]: safeSortOrder,
        'requirementTable.id': 'DESC',
      });
    } else if (INLINE_CASE_SORT_MAP[safeSortBy]) {
      queryBuilder.orderBy({
        [raw(INLINE_CASE_SORT_MAP[safeSortBy])]: safeSortOrder,
        'requirementTable.id': 'DESC',
      });
    } else {
      queryBuilder.orderBy({
        [`requirementTable.${safeSortBy}`]: safeSortOrder,
        ...(safeSortBy !== 'id' ? { 'requirementTable.id': 'DESC' } : {}),
      });
    }

    queryBuilder.limit(limit).offset((page - 1) * limit);

    const [requirements, total] = await queryBuilder.getResultAndCount();

    const institutionIds = Array.from(
      new Set(
        requirements
          .map((requirement) => requirement.requestingInstitutionId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );

    const domainIds = Array.from(
      new Set(
        requirements
          .map((requirement) => requirement.domainInChargeId)
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
        requirement.requestingInstitutionId,
      );
      const domain = domainMap.get(requirement.domainInChargeId);

      return {
        id: requirement.id,
        uuid: requirement.uuid,
        code: requirement.code,
        status: requirement.status,
        name: requirement.name,
        description: requirement.description,
        requesting_institution_id: requirement.requestingInstitutionId,
        requesting_institution_name: institution?.name ?? null,
        requesting_institution: institution
          ? {
              id: institution.id,
              uuid: institution.uuid,
              name: institution.name,
            }
          : null,
        requested_by: requirement.requestedBy,
        benefited_institutions: requirement.benefitedInstitutions,
        total_benefited_institutions: requirement.totalBenefitedInstitutions,
        obligation: requirement.obligation,
        exist_solution_alternative: requirement.existSolutionAlternative,
        study_modality: requirement.studyModality,
        impact_number_users_id: requirement.impactNumberUsersId,
        impact: requirement.impact,
        complexity_and_effort: requirement.complexityAndEffort,
        client_priority: requirement.clientPriority,
        domain_in_charge_id: requirement.domainInChargeId,
        domain_in_charge_name: domain?.name ?? null,
        domain_in_charge: domain
          ? {
              id: domain.id,
              uuid: domain.uuid,
              name: domain.name,
              abbreviation: domain.abbreviation,
            }
          : null,
        domains_collaborators: requirement.domainsCollaborators,
        followers_domains: requirement.followersDomains,
        development_time_in_sprints: requirement.developmentTimeInSprints,
        start_date: requirement.startDate,
        end_date: requirement.endDate,
        type: requirement.type,
        created_at: requirement.createdAt,
        updated_at: requirement.updatedAt,
      };
    });

    const mappedRows = rows.map(toRequirementTableRow);

    return {
      requirements: mappedRows,
      rows: mappedRows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
