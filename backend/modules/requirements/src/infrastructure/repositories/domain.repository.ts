import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { DomainArea } from '@modules/requirements/src/domain/domain-area/domain-area';

@Injectable()
export class DomainRepository extends EntityRepository<DomainArea> {
  constructor(em: EntityManager) {
    super(em, DomainArea);
  }

  async save(domain: DomainArea | DomainArea[]): Promise<void> {
    this.em.persist(domain);
    await this.em.flush();
  }
}
