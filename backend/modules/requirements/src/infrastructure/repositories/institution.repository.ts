import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Institution } from '@modules/requirements/src/domain/requirement/institution/institution';
import { RequirementSort } from '../../domain/requirement/enums/requirement-sort.enum';

@Injectable()
export class InstitutionRepository extends EntityRepository<Institution> {
  constructor(em: EntityManager) {
    super(em, Institution);
  }

  async findByIds(ids: number[]): Promise<Institution[]> {
    return ids.length ? this.find({ id: { $in: ids } }) : [];
  }

  async findAllOrderedByName(): Promise<Institution[]> {
    return this.find(
      {},
      { orderBy: { name: RequirementSort.ASC } },
    );
  }
}
