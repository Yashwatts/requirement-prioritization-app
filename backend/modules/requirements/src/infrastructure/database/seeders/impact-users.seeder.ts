import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { Domain } from '@modules/requirements/src/domain/requirement/domain/domain';
import { ImpactUsers } from '@modules/requirements/src/domain/requirement/impact-users/impact-users';

interface DomainImpactProfile {
  1: { from: number; to: number }; // LOW
  2: { from: number; to: number }; // MEDIUM
  3: { from: number; to: number }; // HIGH
  4: { from: number; to: number }; // VERY_HIGH
}

const DOMAIN_PROFILES: Record<string, DomainImpactProfile> = {
  Financiero: {
    1: { from: 0, to: 10 },
    2: { from: 10, to: 25 },
    3: { from: 25, to: 50 },
    4: { from: 50, to: 100 },
  },
  Ventas: {
    1: { from: 0, to: 15 },
    2: { from: 15, to: 35 },
    3: { from: 35, to: 65 },
    4: { from: 65, to: 100 },
  },
  'Marketing Digital': {
    1: { from: 0, to: 20 },
    2: { from: 20, to: 45 },
    3: { from: 45, to: 75 },
    4: { from: 75, to: 100 },
  },
  'Presencia Web': {
    1: { from: 0, to: 25 },
    2: { from: 25, to: 50 },
    3: { from: 50, to: 75 },
    4: { from: 75, to: 100 },
  },
  'Administración Académica': {
    1: { from: 0, to: 15 },
    2: { from: 15, to: 35 },
    3: { from: 35, to: 60 },
    4: { from: 60, to: 100 },
  },
  'Docencia Académica': {
    1: { from: 0, to: 10 },
    2: { from: 10, to: 25 },
    3: { from: 25, to: 50 },
    4: { from: 50, to: 90 },
  },
  'Envíos Masivos': {
    1: { from: 0, to: 25 },
    2: { from: 25, to: 50 },
    3: { from: 50, to: 75 },
    4: { from: 75, to: 100 },
  },
  Logística: {
    1: { from: 0, to: 10 },
    2: { from: 10, to: 30 },
    3: { from: 30, to: 60 },
    4: { from: 60, to: 100 },
  },
  Reincorporaciones: {
    1: { from: 0, to: 10 },
    2: { from: 10, to: 25 },
    3: { from: 25, to: 50 },
    4: { from: 50, to: 100 },
  },
  Maquetación: {
    1: { from: 0, to: 10 },
    2: { from: 10, to: 20 },
    3: { from: 20, to: 45 },
    4: { from: 45, to: 80 },
  },
  'Catálogo Formativo': {
    1: { from: 0, to: 15 },
    2: { from: 15, to: 30 },
    3: { from: 30, to: 55 },
    4: { from: 55, to: 90 },
  },
  'Planificación Educativa': {
    1: { from: 0, to: 10 },
    2: { from: 10, to: 25 },
    3: { from: 25, to: 50 },
    4: { from: 50, to: 85 },
  },
  'Gestión Docente': {
    1: { from: 0, to: 15 },
    2: { from: 15, to: 30 },
    3: { from: 30, to: 55 },
    4: { from: 55, to: 95 },
  },
  'Acción Docente': {
    1: { from: 0, to: 10 },
    2: { from: 10, to: 25 },
    3: { from: 25, to: 50 },
    4: { from: 50, to: 85 },
  },
  'Calidad Universitaria': {
    1: { from: 0, to: 10 },
    2: { from: 10, to: 20 },
    3: { from: 20, to: 40 },
    4: { from: 40, to: 75 },
  },
  Reportería: {
    1: { from: 0, to: 15 },
    2: { from: 15, to: 35 },
    3: { from: 35, to: 65 },
    4: { from: 65, to: 100 },
  },
  ESEC: {
    1: { from: 0, to: 10 },
    2: { from: 10, to: 25 },
    3: { from: 25, to: 50 },
    4: { from: 50, to: 90 },
  },
  'Proyectos Europeos': {
    1: { from: 0, to: 10 },
    2: { from: 10, to: 20 },
    3: { from: 20, to: 40 },
    4: { from: 40, to: 80 },
  },
};

const DEFAULT_PROFILE: DomainImpactProfile = {
  1: { from: 0, to: 15 },
  2: { from: 15, to: 35 },
  3: { from: 35, to: 65 },
  4: { from: 65, to: 100 },
};

export class ImpactUsersSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    const domains = await entityManager.find(Domain, {});
    const existingImpactLevels = await entityManager.find(ImpactUsers, {});
    const existingMap = new Map<string, ImpactUsers>();
    for (const item of existingImpactLevels) {
      existingMap.set(
        `${item.domain_uuid}:${item.impact_number_users_level}`,
        item,
      );
    }

    const toPersist: ImpactUsers[] = [];

    for (const domain of domains) {
      const profile = DOMAIN_PROFILES[domain.name] ?? DEFAULT_PROFILE;

      for (const level of [1, 2, 3, 4] as const) {
        const key = `${domain.uuid}:${level}`;
        const range = profile[level];
        const existing = existingMap.get(key);

        if (!existing) {
          toPersist.push(
            ImpactUsers.create(domain.uuid, level, {
              from: range.from,
              to: range.to,
            }),
          );
        } else {
          existing.quantity = {
            from: range.from,
            to: range.to,
          };
          toPersist.push(existing);
        }
      }
    }

    if (toPersist.length > 0) {
      await entityManager.persist(toPersist).flush();
    }
  }
}
