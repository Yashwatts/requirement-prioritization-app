import { IQuery } from '@nestjs/cqrs';

export class FetchImpactUsersQuery implements IQuery {
  constructor(
    public readonly domainId?: string,
    public readonly domainUuid?: string,
  ) {}
}
