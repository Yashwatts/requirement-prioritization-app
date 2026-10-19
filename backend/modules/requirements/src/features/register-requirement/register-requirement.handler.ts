import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RequirementDomain } from '../../domain/entity.domain';
import {
  IRequirementRepository,
  REQUIREMENT_REPOSITORY_TOKEN,
} from '../../domain/requirement.repository.interface';
import { RegisterRequirementCommand } from './register-requirement.command';

@CommandHandler(RegisterRequirementCommand)
export class RegisterRequirementHandler implements ICommandHandler<
  RegisterRequirementCommand,
  void
> {
  constructor(
    @Inject(REQUIREMENT_REPOSITORY_TOKEN)
    private readonly requirementRepository: IRequirementRepository,
  ) {}

  async execute(command: RegisterRequirementCommand): Promise<void> {
    const nextCode = await this.requirementRepository.getNextSequenceCode();

    const requirement = RequirementDomain.create({
      code: nextCode,
      name: command.name,
      description: command.description,
      requestingInstitution: command.requestingInstitution,
      requestedBy: command.requestedBy,
      benefitedInstitutions: command.benefitedInstitutions,
      isObligatory: command.isObligatory,
      hasAlternativeSolution: command.hasAlternativeSolution,
      studyModalities: command.studyModalities,
      impactUsers: command.impactUsers,
      complexityEffort: command.complexityEffort,
      collaboratorDomains: command.collaboratorDomains,
      followerDomains: command.followerDomains,
      startDate: command.startDate,
      finishDate: command.finishDate,
      type: command.type,
      domain: command.domain,
      clientPriorityOverride: command.clientPriorityOverride,
      managementPriority: command.managementPriority,
      impactUsersNumericContribution: command.impactUsersNumericContribution,
      impact: command.impactOverride,
    });

    await this.requirementRepository.save(requirement);
  }
}
