import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { Institution } from '@modules/requirements/src/domain/requirement/institution/institution';
import institutionsData from './seeders-json/institution.json';

export class InstitutionsSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    const existingInstitutions = await entityManager.find(Institution, {});
    const institutionByUuid = new Map(
      existingInstitutions.map((institution) => [
        institution.uuid,
        institution,
      ]),
    );

    for (const institutionSeed of institutionsData) {
      const existingInstitution = institutionByUuid.get(institutionSeed.uuid);

      if (existingInstitution) {
        existingInstitution.name = institutionSeed.name;
      } else {
        const newInstitution = Institution.create(
          institutionSeed.name,
          institutionSeed.uuid,
        );
        entityManager.persist(newInstitution);
      }
    }

    await entityManager.flush();
  }
}
