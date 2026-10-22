import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Institution } from '@modules/requirements/src/domain/institution/institution';

@Injectable()
export class InstitutionRepository extends EntityRepository<Institution> {
  constructor(em: EntityManager) {
    super(em, Institution);
  }

  async save(institution: Institution | Institution[]): Promise<void> {
    this.em.persist(institution);
    await this.em.flush();
  }
}
