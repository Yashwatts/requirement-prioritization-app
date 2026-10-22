import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ImpactUsersDomain } from '@modules/requirements/src/domain/impact-users-domain/impact-users-domain';

@Injectable()
export class ImpactUsersDomainRepository extends EntityRepository<ImpactUsersDomain> {
  constructor(em: EntityManager) {
    super(em, ImpactUsersDomain);
  }

  async save(
    impactUsersDomain: ImpactUsersDomain | ImpactUsersDomain[],
  ): Promise<void> {
    this.em.persist(impactUsersDomain);
    await this.em.flush();
  }
}
