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
      const tierByLevel = await this.findOne({
        domain_uuid: domainUuid,
        impact_number_users_level: levelOrId,
      });
      if (tierByLevel) return tierByLevel;

      const tierById = await this.findOne({
        domain_uuid: domainUuid,
        id: levelOrId,
      });
      if (tierById) return tierById;
    }

    return (
      (await this.findOne({ id: levelOrId })) ??
      (await this.findOne({ impact_number_users_level: levelOrId })) ??
      (await this.findOne({ id: 1 }))
    );
  }

  async resolveImpactValue(tierId: number): Promise<number> {
    const tier = await this.findOne({ id: tierId });
    if (!tier) {
      if (tierId >= 1 && tierId <= 4) return tierId;
      throw new Error(`Impact users tier with id ${tierId} not found.`);
    }
    return tier.getAverageQuantity();
  }

  async resolveImpactTier(
    domainIdOrUuid: number | string,
    levelOrId: number,
  ): Promise<{ id: number; level: number; averageQuantity: number }> {
    const tier = await this.findUserImpactRange(domainIdOrUuid, levelOrId);
    return {
      id: tier?.id ?? levelOrId,
      level:
        tier?.impact_number_users_level ??
        (levelOrId >= 1 && levelOrId <= 4 ? levelOrId : 1),
      averageQuantity: tier?.getAverageQuantity() ?? 0,
    };
  }

  async save(impactUsers: ImpactUsers | ImpactUsers[]): Promise<void> {
    this.em.persist(impactUsers);
    await this.em.flush();
  }
}
