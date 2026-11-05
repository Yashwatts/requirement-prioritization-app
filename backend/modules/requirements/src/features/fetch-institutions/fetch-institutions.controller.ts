import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FetchInstitutionsQuery } from './fetch-institutions.query';

@Controller('institutions')
export class FetchInstitutionsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async handle() {
    return this.queryBus.execute(new FetchInstitutionsQuery());
  }
}
