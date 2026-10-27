import { SeedManager } from '@mikro-orm/seeder';
import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

export default (contextName: string): Options => {
  const configService = new ConfigService();
  const moduleName = contextName === 'default' ? '**' : contextName;

  const contextSchemaMap: Record<string, string> = {
    requirements: configService.getOrThrow<string>('DB_REQUIREMENTS_SCHEMA'),
  };

  return {
    driver: PostgreSqlDriver,
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    user: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    dbName: configService.get<string>('DB_DATABASE'),
    schema: contextSchemaMap[contextName],
    entities: [`dist/${moduleName}/src/infrastructure/database/**/*.entity.js`],
    entitiesTs: [
      `modules/${moduleName}/src/infrastructure/database/**/*.entity.ts`,
    ],
    migrations: {
      path: `modules/${moduleName}/src/infrastructure/database/migrations`,
      tableName: 'migrations',
    },
    seeder: {
      path: `dist/${moduleName}/src/infrastructure/database/seeders`,
      pathTs: `modules/${moduleName}/src/infrastructure/database/seeders`,
      defaultSeeder: 'DatabaseSeeder',
    },
    extensions: [SeedManager],
    ensureDatabase: false,
    forceUtcTimezone: true,
    debug: false,
  };
};
