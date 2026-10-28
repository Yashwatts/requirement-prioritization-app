import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ImpactUsers } from '@modules/requirements/src/domain/requirement/impact-users/impact-users';
import { Domain } from '@modules/requirements/src/domain/requirement/domain/domain';

@Injectable()
export class ImpactUsersRepository extends EntityRepository<ImpactUsers> {
  constructor(em: EntityManager) {
    super(em, ImpactUsers);
  }

  async findUserImpactRange(
    domainIdOrUuid: number | string,
    levelOrId: number,
  ): Promise<ImpactUsers | null> {
    let domainUuid: string | undefined;
    if (
      typeof domainIdOrUuid === 'number' ||
      /^\d+$/.test(String(domainIdOrUuid))
    ) {
      const domain = await this.em.findOne(Domain, {
        id: Number(domainIdOrUuid),
      });
      domainUuid = domain?.uuid;
    } else if (domainIdOrUuid) {
      domainUuid = String(domainIdOrUuid);
    }

    if (domainUuid) {
      const rangeByLevel = await this.findOne({
        domain_uuid: domainUuid,
        impact_number_users_level: levelOrId,
      });
      if (rangeByLevel) return rangeByLevel;

      const rangeById = await this.findOne({
        domain_uuid: domainUuid,
        id: levelOrId,
      });
      if (rangeById) return rangeById;
    }

    return (
      (await this.findOne({ id: levelOrId })) ??
      (await this.findOne({ impact_number_users_level: levelOrId })) ??
      (await this.findOne({ id: 1 }))
    );
  }

  async save(impactUsers: ImpactUsers | ImpactUsers[]): Promise<void> {
    this.em.persist(impactUsers);
    await this.em.flush();
  }
}
