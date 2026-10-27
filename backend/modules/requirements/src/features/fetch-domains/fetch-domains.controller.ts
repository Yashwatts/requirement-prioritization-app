import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FetchDomainsQuery } from './fetch-domains.query';

@Controller('domains')
export class FetchDomainsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async handle(): Promise<unknown> {
    return this.queryBus.execute(new FetchDomainsQuery());
  }
}
