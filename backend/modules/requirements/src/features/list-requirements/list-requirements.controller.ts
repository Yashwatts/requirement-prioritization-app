import { Controller, Get, Headers, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ListRequirementsQueryParams } from './list-requirements.validator';
import { ListRequirementsQuery } from './list-requirements.query';
import { ListRequirementsResult } from '../../domain/requirement/interfaces/requirement';

@Controller('requirements')
export class ListRequirementsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async handle(
    @Query() queryParams: ListRequirementsQueryParams,
    @Headers('accept-language') acceptLanguage?: string,
    @Query('lang') queryLang?: string,
  ): Promise<ListRequirementsResult> {
    const lang = queryLang || acceptLanguage;
    const query = new ListRequirementsQuery(queryParams, lang);
    return this.queryBus.execute(query);
  }
}
