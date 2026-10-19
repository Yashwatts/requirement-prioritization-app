import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { RequirementOrmEntity } from '../../../requirements/src/infrastructure/database/entities/requirement.orm-entity';

const config: Options = {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'password',
  dbName: process.env.DB_NAME ?? 'requirement_prioritization_app',
  entities: [RequirementOrmEntity],
  extensions: [Migrator],
  migrations: {
    path: './modules/requirements/src/infrastructure/database/migrations',
    glob: '!(*.d).{js,ts}',
    tableName: 'requirements.mikro_orm_migrations',
    transactional: true,
    allOrNothing: true,
  },
  debug: process.env.NODE_ENV !== 'production',
  allowGlobalContext: false,
};

export default config;
