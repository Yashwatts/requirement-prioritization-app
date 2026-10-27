export class FetchImpactUsersQuery {
  constructor(
    public readonly domainId?: string,
    public readonly domainUuid?: string,
  ) {}
}
