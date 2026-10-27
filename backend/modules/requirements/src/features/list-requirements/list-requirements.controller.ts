import { Controller, Get, Query } from '@nestjs/common';
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
  ): Promise<ListRequirementsResult> {
    return this.queryBus.execute(new ListRequirementsQuery(queryParams));
  }
}
