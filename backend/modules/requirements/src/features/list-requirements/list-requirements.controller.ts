import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ClientPriority,
  DomainArea,
  ManagementPriority,
  RequirementState,
} from '../../domain/requirement/types';
import { ListRequirementsQuery } from './list-requirements.query';
import { ListRequirementsViewModel } from './list-requirements.view-model';

@Controller('requirements')
export class ListRequirementsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async listRequirements(
    @Query('search') search?: string,
    @Query('domain') domain?: DomainArea,
    @Query('state') state?: RequirementState,
    @Query('clientPriority') clientPriority?: ClientPriority,
    @Query('managementPriority') managementPriority?: ManagementPriority,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('page') page = '1',
    @Query('limit') limit = '16',
  ): Promise<ListRequirementsViewModel> {
    return this.queryBus.execute<
      ListRequirementsQuery,
      ListRequirementsViewModel
    >(
      new ListRequirementsQuery(
        search || undefined,
        domain,
        state,
        clientPriority,
        managementPriority,
        sortBy,
        sortOrder,
        Math.max(1, parseInt(page, 10) || 1),
        Math.min(100, parseInt(limit, 10) || 16),
      ),
    );
  }
}
