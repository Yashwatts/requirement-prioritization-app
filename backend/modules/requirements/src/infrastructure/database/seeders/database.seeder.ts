import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';

import { InstitutionsSeeder } from './institutions.seeder';
import { DomainsSeeder } from './domains.seeder';
import { ImpactUsersDomainsSeeder } from './impact-users-domains.seeder';

export class DatabaseSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    return this.call(entityManager, [
      InstitutionsSeeder,
      DomainsSeeder,
      ImpactUsersDomainsSeeder,
    ]);
  }
}
