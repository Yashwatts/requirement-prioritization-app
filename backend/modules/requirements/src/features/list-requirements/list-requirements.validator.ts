import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { RequirementState } from '../../domain/requirement/enums/requirement-state.enum';
import { ClientPriority } from '../../domain/requirement/enums/client-priority.enum';
import { RequirementSort } from '../../domain/requirement/enums/requirement-sort.enum';

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
  @IsEnum(ClientPriority)
  client_priority?: ClientPriority;

  @IsOptional()
  @IsString()
  sort_by: string = 'created_at';

  @IsOptional()
  @IsEnum(RequirementSort)
  sort_order: RequirementSort = RequirementSort.DESC;
}
