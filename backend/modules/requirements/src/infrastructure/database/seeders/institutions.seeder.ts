import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { Institution } from '@modules/requirements/src/domain/institution/institution';

export class InstitutionsSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    const institutionNames = [
      'FUNIBER',
      'UNEATLANTICO',
      'UNIC',
      'UNINCOL',
      'UNIB',
      'UNINI-MX',
      'UNIROMANA',
      'UDAS',
      'Grupo Funiber',
      'Proyectos Europeos',
    ];

    const institutions = institutionNames.map((name) => Institution.create(name));

    await entityManager.persist(institutions).flush();
  }
}
