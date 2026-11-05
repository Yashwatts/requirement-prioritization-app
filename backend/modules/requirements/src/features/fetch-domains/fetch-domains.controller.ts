import { Controller, Get, Headers, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FetchDomainsQuery } from './fetch-domains.query';

@Controller('domains')
export class FetchDomainsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async handle(
    @Headers('accept-language') acceptLanguage?: string,
    @Query('lang') queryLang?: string,
  ) {
    const lang = queryLang || acceptLanguage;
    const query = new FetchDomainsQuery(lang);
    return this.queryBus.execute(query);
  }
}
