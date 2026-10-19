import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IRequirementRepository,
  REQUIREMENT_REPOSITORY_TOKEN,
} from '../../domain/requirement.repository.interface';
import { ListRequirementsQuery } from './list-requirements.query';
import {
  ListRequirementsViewModel,
  RequirementListItemViewModel,
} from './list-requirements.view-model';
import { RequirementDomain } from '../../domain/entity.domain';

@QueryHandler(ListRequirementsQuery)
export class ListRequirementsHandler implements IQueryHandler<
  ListRequirementsQuery,
  ListRequirementsViewModel
> {
  constructor(
    @Inject(REQUIREMENT_REPOSITORY_TOKEN)
    private readonly requirementRepository: IRequirementRepository,
  ) {}

  async execute(
    query: ListRequirementsQuery,
  ): Promise<ListRequirementsViewModel> {
    const result = await this.requirementRepository.find({
      search: query.search,
      domain: query.domain,
      state: query.state,
      clientPriority: query.clientPriority,
      managementPriority: query.managementPriority,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page: query.page,
      limit: query.limit,
    });

    return {
      items: result.items.map((item) => this.toViewModel(item)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  private toViewModel(
    requirement: RequirementDomain,
  ): RequirementListItemViewModel {
    return {
      id: requirement.id,
      code: requirement.code,
      name: requirement.name,
      requestingInstitution: requirement.requestingInstitution,
      requestedBy: requirement.requestedBy,
      domain: requirement.domain,
      collaboratorDomains: requirement.collaboratorDomains,
      followerDomains: requirement.followerDomains,
      benefitedInstitutions: requirement.benefitedInstitutions,
      totalBenefitedInstitutions: requirement.totalBenefitedInstitutions,
      isObligatory: requirement.isObligatory,
      hasAlternativeSolution: requirement.hasAlternativeSolution,
      studyModalities: requirement.studyModalities,
      impactUsers: requirement.impactUsers,
      impact: requirement.impact,
      complexityEffort: requirement.complexityEffort,
      clientPriority: requirement.clientPriority,
      managementPriority: requirement.managementPriority,
      state: requirement.state,
      type: requirement.type,
      startDate: requirement.startDate,
      finishDate: requirement.finishDate,
      createdAt: requirement.createdAt,
    };
  }
}
