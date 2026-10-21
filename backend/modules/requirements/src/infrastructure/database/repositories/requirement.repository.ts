import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RequirementDomain } from '../../../domain/requirement/entity.domain';
import {
  FindRequirementsCriteria,
  IRequirementRepository,
  PaginatedResult,
} from '../../../domain/requirement/requirement.repository.interface';
import { RequirementOrmEntity } from '../entities/requirement.orm-entity';
import { RequirementMapper } from '../mappers/requirement.mapper';

@Injectable()
export class RequirementRepository implements IRequirementRepository {
  constructor(private readonly em: EntityManager) {}

  async getNextSequenceCode(): Promise<number> {
    const result = await this.em
      .getConnection()
      .execute<{ nextval: string }[]>(
        `SELECT nextval('requirements.requirement_code_seq')`,
      );
    return Number(result[0].nextval);
  }

  async save(requirement: RequirementDomain): Promise<void> {
    const existing = await this.em.findOne(RequirementOrmEntity, {
      id: requirement.id,
    });

    if (existing) {
      // Update existing entity in-place
      existing.name = requirement.name;
      existing.description = requirement.description;
      existing.requestingInstitution = requirement.requestingInstitution;
      existing.requestedBy = requirement.requestedBy;
      existing.benefitedInstitutions = requirement.benefitedInstitutions;
      existing.totalBenefitedInstitutions =
        requirement.totalBenefitedInstitutions;
      existing.isObligatory = requirement.isObligatory;
      existing.hasAlternativeSolution = requirement.hasAlternativeSolution;
      existing.studyModalities = requirement.studyModalities;
      existing.impactUsers = requirement.impactUsers;
      existing.impact = requirement.impact;
      existing.complexityEffort = requirement.complexityEffort;
      existing.clientPriority = requirement.clientPriority;
      existing.managementPriority = requirement.managementPriority;
      existing.domain = requirement.domain;
      existing.collaboratorDomains = requirement.collaboratorDomains;
      existing.followerDomains = requirement.followerDomains;
      existing.state = requirement.state;
      existing.startDate = requirement.startDate;
      existing.finishDate = requirement.finishDate;
      existing.type = requirement.type;
      existing.updatedAt = requirement.updatedAt;
    } else {
      const entity = RequirementMapper.toPersistence(requirement);
      this.em.persist(entity);
    }

    await this.em.flush();
  }

  async findById(id: string): Promise<RequirementDomain | null> {
    const entity = await this.em.findOne(RequirementOrmEntity, { id });
    if (!entity) return null;
    return RequirementMapper.toDomain(entity);
  }

  async findByCode(code: number): Promise<RequirementDomain | null> {
    const entity = await this.em.findOne(RequirementOrmEntity, { code });
    if (!entity) return null;
    return RequirementMapper.toDomain(entity);
  }

  async find(
    criteria: FindRequirementsCriteria,
  ): Promise<PaginatedResult<RequirementDomain>> {
    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 16;
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (criteria.domain) where.domain = criteria.domain;
    if (criteria.state) where.state = criteria.state;
    if (criteria.clientPriority) where.clientPriority = criteria.clientPriority;
    if (criteria.managementPriority)
      where.managementPriority = criteria.managementPriority;

    // Text search over name
    if (criteria.search) {
      where.name = { $like: `%${criteria.search}%` };
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (criteria.sortBy) {
      orderBy[criteria.sortBy] = criteria.sortOrder ?? 'ASC';
    } else {
      orderBy.code = 'ASC';
    }

    const [entities, total] = await this.em.findAndCount(
      RequirementOrmEntity,
      where,
      {
        orderBy,
        limit,
        offset,
      },
    );

    return {
      items: entities.map((entity) => RequirementMapper.toDomain(entity)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(): Promise<RequirementDomain[]> {
    const entities = await this.em.findAll(RequirementOrmEntity, {
      orderBy: { code: 'ASC' },
    });
    return entities.map((entity) => RequirementMapper.toDomain(entity));
  }
}
