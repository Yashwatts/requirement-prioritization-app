import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ImpactUsersRepository } from '../../infrastructure/repositories/impact-users.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { FetchImpactUsersQuery } from './fetch-impact-users.query';

const LEVEL_MAP: Record<number, 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'> = {
  1: 'LOW',
  2: 'MEDIUM',
  3: 'HIGH',
  4: 'VERY_HIGH',
};

@QueryHandler(FetchImpactUsersQuery)
export class FetchImpactUsersHandler implements IQueryHandler<FetchImpactUsersQuery> {
  constructor(
    private readonly impactUsersRepository: ImpactUsersRepository,
    private readonly domainRepository: DomainRepository,
  ) {}

  async execute(query: FetchImpactUsersQuery) {
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

    const rows = await this.impactUsersRepository.find(filter, {
      orderBy: { impact_number_users_level: 'ASC' },
    });

    const grouped = new Map<
      string,
      {
        domain_uuid: string;
        impact_users: {
          LOW?: { from: number; to: number };
          MEDIUM?: { from: number; to: number };
          HIGH?: { from: number; to: number };
          VERY_HIGH?: { from: number; to: number };
        };
      }
    >();

    for (const row of rows) {
      if (!grouped.has(row.domain_uuid)) {
        grouped.set(row.domain_uuid, {
          domain_uuid: row.domain_uuid,
          impact_users: {},
        });
      }

      const item = grouped.get(row.domain_uuid)!;
      const key = LEVEL_MAP[row.impact_number_users_level];
      if (key) {
        item.impact_users[key] = {
          from: row.quantity.from,
          to: row.quantity.to,
        };
      }
    }

    return Array.from(grouped.values());
  }
}
