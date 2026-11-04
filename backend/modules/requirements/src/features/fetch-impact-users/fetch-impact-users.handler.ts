import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ImpactUsersRepository } from '../../infrastructure/repositories/impact-users.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { UserImpactLevel } from '../../domain/requirement/enums/user-impact-level.enum';
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
    private readonly domainRepository: DomainRepository,
  ) {}

  async execute(
    query: FetchImpactUsersQuery,
  ): Promise<ImpactUsersResponse[]> {
    let resolvedUuid = query.domainUuid;

    if (!resolvedUuid && query.domainId) {
      const isNumeric = /^\d+$/.test(query.domainId);
      const domain = isNumeric
        ? await this.domainRepository.findOne({ id: Number(query.domainId) })
        : await this.domainRepository.findOne({ uuid: query.domainId });

      if (domain) {
        resolvedUuid = domain.uuid;
      }
    }

    const filter: Record<string, unknown> = {};
    if (resolvedUuid) {
      filter.domain_uuid = resolvedUuid;
    }

    const impactUserRecords = await this.impactUsersRepository.find(filter, {
      orderBy: { impact_number_users_level: 'ASC' },
    });

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
      const levelKey =
        typeof impactUserRecord.impact_number_users_level === 'number'
          ? UserImpactLevel[impactUserRecord.impact_number_users_level]
          : impactUserRecord.impact_number_users_level;

      if (levelKey) {
        domainImpactGroup.impact_users.push({
          id: impactUserRecord.id,
          name: String(levelKey),
          from: impactUserRecord.quantity?.from ?? 0,
          to: impactUserRecord.quantity?.to ?? 0,
        });
      }
    }

    return Array.from(groupedDomainImpactMap.values());
  }
}
