import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { Requirement } from '@modules/requirements/src/domain/requirement/requirement';

@Injectable()
export class RequirementRepository extends EntityRepository<Requirement> {
  constructor(em: EntityManager) {
    super(em, Requirement);
  }

  async findByUuid(uuid: string): Promise<Requirement | null> {
    return this.findOne({ uuid });
  }

  async save(requirement: Requirement | Requirement[]): Promise<void> {
    this.em.persist(requirement);
    await this.em.flush();
  }

  async search(
    criteria: FilterQuery<Requirement>,
    options: FindOptions<Requirement>,
  ): Promise<[Requirement[], number]> {
    return this.findAndCount(criteria, options);
  }
}
