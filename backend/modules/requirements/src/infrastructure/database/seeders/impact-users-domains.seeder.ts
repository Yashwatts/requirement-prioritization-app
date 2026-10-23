import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { DomainArea } from '@modules/requirements/src/domain/domain-area/domain-area';
import { ImpactUsersDomain } from '@modules/requirements/src/domain/impact-users-domain/impact-users-domain';

export const IMPACT_USER_LEVELS = [
  { level: 1, label: 'Low', from: 0, to: 0 },
  { level: 2, label: 'Medium', from: 0, to: 0 },
  { level: 3, label: 'High', from: 0, to: 0 },
  { level: 4, label: 'Very High', from: 0, to: 0 },
];

export class ImpactUsersDomainsSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    const domains = await entityManager.find(DomainArea, {});
    const existingImpactLevels = await entityManager.find(
      ImpactUsersDomain,
      {},
    );
    const existingKeys = new Set(
      existingImpactLevels.map(
        (item) => `${item.domain_uuid}:${item.impact_number_users_level}`,
      ),
    );

    const impactLevels: ImpactUsersDomain[] = [];

    for (const domain of domains) {
      for (const impactLevel of IMPACT_USER_LEVELS) {
        const key = `${domain.uuid}:${impactLevel.level}`;
        if (!existingKeys.has(key)) {
          impactLevels.push(
            ImpactUsersDomain.create(domain.uuid, impactLevel.level, {
              from: impactLevel.from,
              to: impactLevel.to,
              label: impactLevel.label,
            }),
          );
        }
      }
    }

    if (impactLevels.length > 0) {
      await entityManager.persist(impactLevels).flush();
    }
  }
}
