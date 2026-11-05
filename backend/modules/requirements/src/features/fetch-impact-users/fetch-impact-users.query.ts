import { IQuery } from '@nestjs/cqrs';

export class FetchImpactUsersQuery implements IQuery {
  constructor(public readonly domainUuid?: string) {}
}
