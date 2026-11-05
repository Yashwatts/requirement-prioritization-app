import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { Domain } from '@modules/requirements/src/domain/requirement/domain/domain';
import domainsData from './seeders-json/domain.json';

export class DomainsSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    const existingDomains = await entityManager.find(Domain, {});
    const domainByUuid = new Map(
      existingDomains.map((domain) => [domain.uuid, domain]),
    );

    for (const domainSeed of domainsData) {
      const existingDomain = domainByUuid.get(domainSeed.uuid);

      if (existingDomain) {
        existingDomain.name = domainSeed.name;
        existingDomain.abbreviation = domainSeed.abbreviation;
        existingDomain.email = domainSeed.email;
        existingDomain.translations = domainSeed.translations;
      } else {
        const newDomain = Domain.create(
          domainSeed.name,
          domainSeed.abbreviation,
          domainSeed.email,
          domainSeed.translations,
          domainSeed.uuid,
        );
        entityManager.persist(newDomain);
      }
    }

    await entityManager.flush();
  }
}
