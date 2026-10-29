import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ImpactUsersRepository } from '../../infrastructure/repositories/impact-users.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { UserImpactLevel } from '../../domain/requirement/enums/user-impact-level.enum';
import { FetchImpactUsersQuery } from './fetch-impact-users.query';

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
          LOW?: { id: number; from: number; to: number };
          MEDIUM?: { id: number; from: number; to: number };
          HIGH?: { id: number; from: number; to: number };
          VERY_HIGH?: { id: number; from: number; to: number };
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

      const domainImpactGroup = grouped.get(row.domain_uuid)!;
      const levelKey = UserImpactLevel[row.impact_number_users_level] as
        keyof typeof domainImpactGroup.impact_users | undefined;
      if (levelKey) {
        domainImpactGroup.impact_users[levelKey] = {
          id: row.id,
          from: row.quantity.from,
          to: row.quantity.to,
        };
      }
    }

    return Array.from(grouped.values());
  }
}
