import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetRequirementQuery } from './get-requirement.query';
import { RequirementDetailViewModel } from './get-requirement.view-model';

@Controller('requirements')
export class GetRequirementController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getRequirement(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RequirementDetailViewModel> {
    return this.queryBus.execute<
      GetRequirementQuery,
      RequirementDetailViewModel
    >(new GetRequirementQuery(id));
  }
}
