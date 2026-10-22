import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { QueryOrder } from '@mikro-orm/core';

import { RequirementState } from '../../domain/requirement/enums/requirement-state.enum';
import { ClientPriority } from '../../domain/requirement/enums/client-priority.enum';
import { ManagementPriority } from '../../domain/requirement/enums/management-priority.enum';

export enum RequirementSortField {
  CODE = 'code',
  NAME = 'name',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  CLIENT_PRIORITY = 'client_priority',
  MANAGEMENT_PRIORITY = 'management_priority',
}

export class ListRequirementsQueryParams {
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(RequirementState)
  status?: RequirementState;

  @IsOptional()
  @IsEnum(RequirementState)
  state?: RequirementState;

  @IsOptional()
  @IsEnum(ClientPriority)
  client_priority?: ClientPriority;

  @IsOptional()
  @IsEnum(ManagementPriority)
  management_priority?: ManagementPriority;

  @IsOptional()
  @IsEnum(RequirementSortField)
  sort_by: RequirementSortField = RequirementSortField.CREATED_AT;

  @IsOptional()
  @IsEnum(QueryOrder)
  sort_order: QueryOrder = QueryOrder.DESC;
}
