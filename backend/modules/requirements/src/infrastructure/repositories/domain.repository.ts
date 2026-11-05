import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Domain } from '@modules/requirements/src/domain/requirement/domain/domain';
import { RequirementSort } from '../../domain/requirement/enums/requirement-sort.enum';

@Injectable()
export class DomainRepository extends EntityRepository<Domain> {
  constructor(em: EntityManager) {
    super(em, Domain);
  }

  async findById(id: number): Promise<Domain | null> {
    return this.findOne({ id });
  }

  async findByIds(ids: number[]): Promise<Domain[]> {
    return ids.length ? this.find({ id: { $in: ids } }) : [];
  }

  async findAllOrderedByName(): Promise<Domain[]> {
    return this.find(
      {},
      { orderBy: { name: RequirementSort.ASC } },
    );
  }
}
