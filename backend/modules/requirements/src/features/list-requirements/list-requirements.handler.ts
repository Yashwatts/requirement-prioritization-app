import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { ListRequirementsQuery } from './list-requirements.query';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { ImpactUsersRepository } from '../../infrastructure/repositories/impact-users.repository';
import { ListRequirementsResult } from '../../domain/requirement/interfaces/requirement';
import { StudyModality } from '../../domain/requirement/enums/study-modality.enum';
import { RequirementSort } from '../../domain/requirement/enums/requirement-sort.enum';
import { Institution } from '../../domain/requirement/institution/institution';
import { Domain } from '../../domain/requirement/domain/domain';
import { ImpactUsers } from '../../domain/requirement/impact-users/impact-users';
import { Requirement } from '../../domain/requirement/requirement';

@QueryHandler(ListRequirementsQuery)
export class ListRequirementsHandler implements IQueryHandler<
  ListRequirementsQuery,
  ListRequirementsResult
> {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly institutionRepository: InstitutionRepository,
    private readonly domainRepository: DomainRepository,
    private readonly impactUsersRepository: ImpactUsersRepository,
  ) {}

  async execute({
    params,
    lang: rawLang,
  }: ListRequirementsQuery): Promise<ListRequirementsResult> {
    const filter: FilterQuery<Requirement> = {};

    if (params.status) {
      filter.status = params.status;
    }

    if (params.client_priority) {
      filter.clientPriority = params.client_priority;
    }

    if (params.search && params.search.trim()) {
      const trimmedSearch = params.search.trim();
      const numericCode = Number(trimmedSearch);
      const isNumeric = Number.isInteger(numericCode) && numericCode > 0;

      filter.$or = [
        { name: { $ilike: `%${trimmedSearch}%` } },
        { description: { $ilike: `%${trimmedSearch}%` } },
        ...(isNumeric ? [{ code: numericCode }] : []),
      ];
    }

    const SORT_PROPERTY_MAP: Record<string, keyof Requirement> = {
      id: 'id',
      code: 'code',
      name: 'name',
      status: 'status',
      impact: 'impact',
      client_priority: 'clientPriority',
      complexity_and_effort: 'complexityAndEffort',
      domain_in_charge_id: 'domainInChargeId',
      requesting_institution_id: 'requestingInstitutionId',
      obligation: 'obligation',
      exist_solution_alternative: 'existSolutionAlternative',
      impact_number_users_id: 'impactNumberUsersId',
      start_date: 'startDate',
      end_date: 'endDate',
      type: 'type',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };

    const sortProperty = SORT_PROPERTY_MAP[params.sort_by] ?? 'createdAt';
    const sortDirection =
      params.sort_order === RequirementSort.ASC
        ? QueryOrder.ASC
        : QueryOrder.DESC;

    const [requirements, total] = await this.requirementRepository.search(
      filter,
      {
        orderBy: { [sortProperty]: sortDirection, id: QueryOrder.DESC },
        limit: params.limit,
        offset: (params.page - 1) * params.limit,
      },
    );

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

    const impactUserIds = Array.from(
      new Set(
        requirements
          .map((requirement) => requirement.impactNumberUsersId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );

    const institutions: Institution[] =
      await this.institutionRepository.findByIds(institutionIds);

    const domains: Domain[] =
      await this.domainRepository.findByIds(domainIds);

    const impactUsersRecords: ImpactUsers[] =
      await this.impactUsersRepository.findByIds(impactUserIds);

    const institutionMap = new Map<number, Institution>(
      institutions.map((institution) => [institution.id, institution]),
    );
    const domainMap = new Map<number, Domain>(
      domains.map((domain) => [domain.id, domain]),
    );
    const impactUsersMap = new Map<number, ImpactUsers>(
      impactUsersRecords.map((item) => [item.id, item]),
    );

    const IMPACT_LEVEL_DISPLAY: Record<string, string> = {
      LOW: 'Low',
      MEDIUM: 'Medium',
      HIGH: 'High',
      VERY_HIGH: 'Very High',
    };

    const lang = rawLang ? rawLang.toLowerCase() : '';
    const isEnglish = lang.startsWith('en') || lang.includes('en_us');

    const mappedRows = requirements.map((requirement) => {
      const institution = institutionMap.get(
        requirement.requestingInstitutionId,
      );
      const domain = domainMap.get(requirement.domainInChargeId);
      const impactRecord = impactUsersMap.get(requirement.impactNumberUsersId);

      const requestingInstitution = institution ? institution.name : '';
      const domainTranslation =
        isEnglish && domain?.translations?.en_US
          ? String(domain.translations.en_US).trim()
          : '';
      const domainName = domainTranslation || (domain ? domain.name : '');

      const requestedByList = requirement.requestedBy || [];
      const requestedBy = requestedByList.join(', ');
      const collaboratorDomains = requirement.domainsCollaborators || [];
      const followerDomains = requirement.followersDomains || [];
      const benefitedInstitutions = requirement.benefitedInstitutions || [];

      const studyModalities =
        requirement.studyModality === StudyModality.VIRTUAL_PRESENCIAL
          ? ['Virtual', 'Presencial']
          : [requirement.studyModality];

      const startDate = requirement.startDate
        ? new Date(requirement.startDate).toISOString().split('T')[0]
        : null;

      const finishDate = requirement.endDate
        ? new Date(requirement.endDate).toISOString().split('T')[0]
        : null;

      const impactLevel = impactRecord
        ? IMPACT_LEVEL_DISPLAY[impactRecord.impact_number_users_level]
        : 'Low';

      return {
        id: requirement.uuid ? requirement.uuid : String(requirement.id),
        numericId: requirement.id,
        code: requirement.code,
        name: requirement.name,
        description: requirement.description,
        requestingInstitution,
        requestingInstitutionId: requirement.requestingInstitutionId,
        requestedBy,
        requestedByList,
        domain: domainName,
        domainId: requirement.domainInChargeId,
        collaboratorDomains,
        followerDomains,
        benefitedInstitutions,
        totalBenefitedInstitutions: requirement.totalBenefitedInstitutions,
        isObligatory: Boolean(requirement.obligation),
        hasAlternativeSolution: Boolean(requirement.existSolutionAlternative),
        studyModalities,
        studyModalityId: requirement.studyModality,
        impactUsers: impactLevel,
        impactUsersId: requirement.impactNumberUsersId,
        impact: requirement.impact,
        complexityEffort: requirement.complexityAndEffort,
        complexityEffortId: requirement.complexityAndEffort,
        clientPriority: requirement.clientPriority,
        clientPriorityId: requirement.clientPriority,
        status: requirement.status,
        statusId: requirement.status,
        type: requirement.type,
        typeId: requirement.type,
        developmentTimeInSprints: requirement.developmentTimeInSprints,
        startDate,
        finishDate,
        createdAt: requirement.createdAt
          ? new Date(requirement.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: requirement.updatedAt
          ? new Date(requirement.updatedAt).toISOString()
          : new Date().toISOString(),
      };
    });

    return {
      requirements: mappedRows,
      rows: mappedRows,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
    };
  }
}
