import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { DomainArea } from '@modules/requirements/src/domain/domain-area/domain-area';
import { ImpactUsersDomain } from '@modules/requirements/src/domain/impact-users-domain/impact-users-domain';

export class ImpactUsersDomainsSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    const domains = await entityManager.find(DomainArea, {});

    const impactLevels: ImpactUsersDomain[] = [];

    for (const domain of domains) {
      // Specific domain threshold multipliers (e.g. Ventas, Envíos Masivos, Presencia Web have higher user scale)
      const isHighVolume = ['VEN', 'MKT', 'WEB', 'ENV_MAS'].includes(domain.abbreviation);

      const ranges = isHighVolume
        ? [
            { level: 1, from: 1, to: 100, label: '1 - 100' },
            { level: 2, from: 101, to: 500, label: '101 - 500' },
            { level: 3, from: 501, to: 2000, label: '501 - 2000' },
            { level: 4, from: 2001, to: 10000, label: '> 2000' },
          ]
        : [
            { level: 1, from: 1, to: 50, label: '1 - 50' },
            { level: 2, from: 51, to: 200, label: '51 - 200' },
            { level: 3, from: 201, to: 500, label: '201 - 500' },
            { level: 4, from: 501, to: 1000, label: '> 500' },
          ];

      for (const range of ranges) {
        impactLevels.push(
          ImpactUsersDomain.create(domain.uuid, range.level, {
            from: range.from,
            to: range.to,
            label: range.label,
          }),
        );
      }
    }

    await entityManager.persist(impactLevels).flush();
  }
}
