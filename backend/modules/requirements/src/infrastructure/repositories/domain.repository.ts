import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Domain } from '@modules/requirements/src/domain/requirement/domain/domain';

@Injectable()
export class DomainRepository extends EntityRepository<Domain> {
  constructor(em: EntityManager) {
    super(em, Domain);
  }

  async save(domain: Domain | Domain[]): Promise<void> {
    this.em.persist(domain);
    await this.em.flush();
  }
}
