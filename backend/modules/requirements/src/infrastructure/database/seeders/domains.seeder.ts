import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { DomainArea } from '@modules/requirements/src/domain/domain-area/domain-area';

export const DOMAINS_DATA = [
  { name: 'Financiero', abbreviation: 'FIN', email: 'financiero@funiber.org' },
  {
    name: 'Reincorporaciones',
    abbreviation: 'REINC',
    email: 'reincorporaciones@funiber.org',
  },
  { name: 'Ventas', abbreviation: 'VEN', email: 'ventas@funiber.org' },
  {
    name: 'Marketing Digital',
    abbreviation: 'MKT',
    email: 'marketing.digital@funiber.org',
  },
  {
    name: 'Administración Académica',
    abbreviation: 'ADM_ACAD',
    email: 'administracion.academica@funiber.org',
  },
  { name: 'Logística', abbreviation: 'LOG', email: 'logistica@funiber.org' },
  {
    name: 'Maquetación',
    abbreviation: 'MAQ',
    email: 'maquetacion@funiber.org',
  },
  {
    name: 'Presencia Web',
    abbreviation: 'WEB',
    email: 'presencia.web@funiber.org',
  },
  {
    name: 'Envíos Masivos',
    abbreviation: 'ENV_MAS',
    email: 'envios.masivos@funiber.org',
  },
  {
    name: 'Docencia Académica',
    abbreviation: 'DOC_ACAD',
    email: 'docencia.academica@funiber.org',
  },
  {
    name: 'Catálogo Formativo',
    abbreviation: 'CAT_FORM',
    email: 'catalogo.formativo@funiber.org',
  },
  {
    name: 'Planificación Educativa',
    abbreviation: 'PLAN_ED',
    email: 'planificacion.educativa@funiber.org',
  },
  {
    name: 'Gestión Docente',
    abbreviation: 'GEST_DOC',
    email: 'gestion.docente@funiber.org',
  },
  {
    name: 'Acción Docente',
    abbreviation: 'ACC_DOC',
    email: 'accion.docente@funiber.org',
  },
  {
    name: 'Calidad Universitaria',
    abbreviation: 'CAL_UNIV',
    email: 'calidad.universitaria@funiber.org',
  },
  { name: 'Reportería', abbreviation: 'REP', email: 'reporteria@funiber.org' },
  { name: 'ESEC', abbreviation: 'ESEC', email: 'esec@funiber.org' },
  {
    name: 'Proyectos Europeos',
    abbreviation: 'PROY_EUR',
    email: 'proyectos.europeos@funiber.org',
  },
];

export class DomainsSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    const existingDomains = await entityManager.find(DomainArea, {
      name: { $in: DOMAINS_DATA.map((item) => item.name) },
    });
    const existingNames = new Set(existingDomains.map((d) => d.name));

    const newDomains = DOMAINS_DATA.filter(
      (item) => !existingNames.has(item.name),
    ).map((item) =>
      DomainArea.create(item.name, item.abbreviation, item.email),
    );

    if (newDomains.length > 0) {
      await entityManager.persist(newDomains).flush();
    }
  }
}
