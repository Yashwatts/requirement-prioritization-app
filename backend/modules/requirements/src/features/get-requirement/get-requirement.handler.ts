import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IRequirementRepository,
  REQUIREMENT_REPOSITORY_TOKEN,
} from '../../domain/requirement.repository.interface';
import { RequirementDomain } from '../../domain/entity.domain';
import { RequirementNotFoundException } from '../../domain/exceptions';
import { GetRequirementQuery } from './get-requirement.query';
import { RequirementDetailViewModel } from './get-requirement.view-model';

@QueryHandler(GetRequirementQuery)
export class GetRequirementHandler implements IQueryHandler<
  GetRequirementQuery,
  RequirementDetailViewModel
> {
  constructor(
    @Inject(REQUIREMENT_REPOSITORY_TOKEN)
    private readonly requirementRepository: IRequirementRepository,
  ) {}

  async execute(
    query: GetRequirementQuery,
  ): Promise<RequirementDetailViewModel> {
    const requirement = await this.requirementRepository.findById(query.id);
    if (!requirement) {
      throw new RequirementNotFoundException(query.id);
    }
    return this.toViewModel(requirement);
  }

  private toViewModel(
    requirement: RequirementDomain,
  ): RequirementDetailViewModel {
    return {
      id: requirement.id,
      code: requirement.code,
      name: requirement.name,
      description: requirement.description,
      requestingInstitution: requirement.requestingInstitution,
      requestedBy: requirement.requestedBy,
      type: requirement.type,
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
      startDate: requirement.startDate,
      finishDate: requirement.finishDate,
      createdAt: requirement.createdAt,
      updatedAt: requirement.updatedAt,
    };
  }
}
