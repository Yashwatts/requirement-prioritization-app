import { ICommand } from '@nestjs/cqrs';
import {
  BenefitedInstitution,
  ClientPriority,
  ComplexityEffort,
  DomainArea,
  ManagementPriority,
  RequestingInstitution,
  RequirementType,
  StudyModality,
  UserImpactLevel,
} from '../../domain/types';

export class RegisterRequirementCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly requestingInstitution: RequestingInstitution,
    public readonly requestedBy: string,
    public readonly type: RequirementType,
    public readonly domain: DomainArea,
    public readonly benefitedInstitutions: BenefitedInstitution[],
    public readonly studyModalities: StudyModality[],
    public readonly isObligatory: boolean,
    public readonly hasAlternativeSolution: boolean,
    public readonly impactUsers: UserImpactLevel,
    public readonly complexityEffort: ComplexityEffort,
    public readonly collaboratorDomains: DomainArea[],
    public readonly followerDomains: DomainArea[],
    public readonly startDate: Date | null,
    public readonly finishDate: Date | null,
    public readonly clientPriorityOverride: ClientPriority | undefined,
    public readonly managementPriority: ManagementPriority | undefined,
    public readonly impactUsersNumericContribution?: number,
    public readonly impactOverride?: number,
  ) {}
}
