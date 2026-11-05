import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ImpactUsersRepository } from '../../infrastructure/repositories/impact-users.repository';
import { FetchImpactUsersQuery } from './fetch-impact-users.query';

export interface ImpactUserItem {
  id: number;
  name: string;
  from: number;
  to: number;
}

export interface ImpactUsersResponse {
  domain_uuid: string;
  impact_users: ImpactUserItem[];
}

@QueryHandler(FetchImpactUsersQuery)
export class FetchImpactUsersHandler
  implements IQueryHandler<FetchImpactUsersQuery, ImpactUsersResponse[]>
{
  constructor(
    private readonly impactUsersRepository: ImpactUsersRepository,
  ) {}

  async execute(
    query: FetchImpactUsersQuery,
  ): Promise<ImpactUsersResponse[]> {
    const impactUserRecords =
      await this.impactUsersRepository.findOrderedByLevel(query.domainUuid);

    const groupedDomainImpactMap = new Map<string, ImpactUsersResponse>();

    for (const impactUserRecord of impactUserRecords) {
      if (!groupedDomainImpactMap.has(impactUserRecord.domain_uuid)) {
        groupedDomainImpactMap.set(impactUserRecord.domain_uuid, {
          domain_uuid: impactUserRecord.domain_uuid,
          impact_users: [],
        });
      }

      const domainImpactGroup = groupedDomainImpactMap.get(
        impactUserRecord.domain_uuid,
      )!;
      const levelKey = impactUserRecord.impact_number_users_level;

      if (levelKey) {
        domainImpactGroup.impact_users.push({
          id: impactUserRecord.id,
          name: String(levelKey),
          from: impactUserRecord.quantity.from,
          to: impactUserRecord.quantity.to,
        });
      }
    }

    return Array.from(groupedDomainImpactMap.values());
  }
}
