import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Requirement } from '@modules/requirements/src/domain/requirement/requirement';

@Injectable()
export class RequirementRepository extends EntityRepository<Requirement> {
  constructor(em: EntityManager) {
    super(em, Requirement);
  }

  async save(requirement: Requirement | Requirement[]): Promise<void> {
    this.em.persist(requirement);
    await this.em.flush();
  }

  async remove(requirement: Requirement): Promise<void> {
    this.em.remove(requirement);
    await this.em.flush();
  }
}
