import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { ImpactUsers } from '@modules/requirements/src/domain/requirement/impact-users/impact-users';
import { UserImpactLevel } from '@modules/requirements/src/domain/requirement/enums/user-impact-level.enum';
import impactUsersData from './seeders-json/impact-users.json';

export class ImpactUsersSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    const existingImpactLevels = await entityManager.find(ImpactUsers, {});
    const existingImpactUsersMap = new Map<string, ImpactUsers>();

    for (const impactUsersRecord of existingImpactLevels) {
      existingImpactUsersMap.set(
        `${impactUsersRecord.domain_uuid}:${impactUsersRecord.impact_number_users_level}`,
        impactUsersRecord,
      );
    }

    const recordsToPersist: ImpactUsers[] = [];

    for (const impactUserSeed of impactUsersData) {
      const impactLevel =
        impactUserSeed.impact_number_users_level as UserImpactLevel;
      const lookupKey = `${impactUserSeed.domain_uuid}:${impactLevel}`;
      const existingImpactUser = existingImpactUsersMap.get(lookupKey);

      if (existingImpactUser) {
        existingImpactUser.quantity = impactUserSeed.quantity;
        recordsToPersist.push(existingImpactUser);
      } else {
        const newRecord = ImpactUsers.create(
          impactUserSeed.domain_uuid,
          impactLevel,
          impactUserSeed.quantity,
        );
        recordsToPersist.push(newRecord);
      }
    }

    if (recordsToPersist.length > 0) {
      await entityManager.persist(recordsToPersist).flush();
    }
  }
}
