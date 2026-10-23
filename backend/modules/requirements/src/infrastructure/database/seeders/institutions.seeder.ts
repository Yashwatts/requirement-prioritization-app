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

    const existingInstitutions = await entityManager.find(Institution, {
      name: { $in: institutionNames },
    });
    const existingNames = new Set(
      existingInstitutions.map((inst) => inst.name),
    );

    const newInstitutions = institutionNames
      .filter((name) => !existingNames.has(name))
      .map((name) => Institution.create(name));

    if (newInstitutions.length > 0) {
      await entityManager.persist(newInstitutions).flush();
    }
  }
}
