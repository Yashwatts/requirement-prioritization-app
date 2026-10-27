import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FetchImpactUsersQuery } from './fetch-impact-users.query';

@Controller('impact-users')
export class FetchImpactUsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async handleImpactUsers(
    @Query('domain_id') domainId?: string,
    @Query('domain_uuid') domainUuid?: string,
  ): Promise<unknown> {
    return this.queryBus.execute(
      new FetchImpactUsersQuery(domainId, domainUuid),
    );
  }
}
