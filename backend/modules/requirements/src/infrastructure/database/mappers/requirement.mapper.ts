import { RequirementDomain } from '../../../domain/entity.domain';
import { RequirementOrmEntity } from '../entities/requirement.orm-entity';

export class RequirementMapper {
  public static toDomain(orm: RequirementOrmEntity): RequirementDomain {
    return RequirementDomain.reconstitute({
      id: orm.id,
      code: orm.code,
      name: orm.name,
      description: orm.description,
      requestingInstitution: orm.requestingInstitution,
      requestedBy: orm.requestedBy,
      benefitedInstitutions: orm.benefitedInstitutions,
      totalBenefitedInstitutions: orm.totalBenefitedInstitutions,
      isObligatory: orm.isObligatory,
      hasAlternativeSolution: orm.hasAlternativeSolution,
      studyModalities: orm.studyModalities,
      impactUsers: orm.impactUsers,
      impact: orm.impact,
      complexityEffort: orm.complexityEffort,
      clientPriority: orm.clientPriority,
      managementPriority: orm.managementPriority,
      domain: orm.domain,
      collaboratorDomains: orm.collaboratorDomains,
      followerDomains: orm.followerDomains,
      state: orm.state,
      startDate: orm.startDate ?? null,
      finishDate: orm.finishDate ?? null,
      type: orm.type,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  public static toPersistence(domain: RequirementDomain): RequirementOrmEntity {
    const entity = new RequirementOrmEntity();
    entity.id = domain.id;
    entity.code = domain.code;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.requestingInstitution = domain.requestingInstitution;
    entity.requestedBy = domain.requestedBy;
    entity.benefitedInstitutions = domain.benefitedInstitutions;
    entity.totalBenefitedInstitutions = domain.totalBenefitedInstitutions;
    entity.isObligatory = domain.isObligatory;
    entity.hasAlternativeSolution = domain.hasAlternativeSolution;
    entity.studyModalities = domain.studyModalities;
    entity.impactUsers = domain.impactUsers;
    entity.impact = domain.impact;
    entity.complexityEffort = domain.complexityEffort;
    entity.clientPriority = domain.clientPriority;
    entity.managementPriority = domain.managementPriority;
    entity.domain = domain.domain;
    entity.collaboratorDomains = domain.collaboratorDomains;
    entity.followerDomains = domain.followerDomains;
    entity.state = domain.state;
    entity.startDate = domain.startDate;
    entity.finishDate = domain.finishDate;
    entity.type = domain.type;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
