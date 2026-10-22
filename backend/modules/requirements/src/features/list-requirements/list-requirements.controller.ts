import { Controller, Get, Query } from '@nestjs/common';
import { ListRequirementsHandler } from './list-requirements.handler';
import { ListRequirementsQueryParams } from './list-requirements.validator';
import { ListRequirementsQuery } from './list-requirements.query';
import { ListRequirementsResult } from '../../domain/requirement/interfaces/requirement';

@Controller('requirements')
export class ListRequirementsController {
  constructor(private readonly handler: ListRequirementsHandler) {}

  @Get()
  async handle(
    @Query() queryParams: ListRequirementsQueryParams,
  ): Promise<ListRequirementsResult> {
    const query = new ListRequirementsQuery(queryParams);

    return this.handler.handle(query);
  }
}
