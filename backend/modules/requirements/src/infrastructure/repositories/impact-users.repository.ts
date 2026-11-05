import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ImpactUsers } from '@modules/requirements/src/domain/requirement/impact-users/impact-users';
import { RequirementSort } from '../../domain/requirement/enums/requirement-sort.enum';

@Injectable()
export class ImpactUsersRepository extends EntityRepository<ImpactUsers> {
  constructor(em: EntityManager) {
    super(em, ImpactUsers);
  }

  async findByIds(ids: number[]): Promise<ImpactUsers[]> {
    return ids.length ? this.find({ id: { $in: ids } }) : [];
  }

  async findOrderedByLevel(domainUuid?: string): Promise<ImpactUsers[]> {
    return this.find(
      domainUuid ? { domain_uuid: domainUuid } : {},
      { orderBy: { impact_number_users_level: RequirementSort.ASC } },
    );
  }
}
