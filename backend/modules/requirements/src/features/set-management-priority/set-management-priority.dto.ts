import { IsEnum } from 'class-validator';
import { ManagementPriority } from '../../domain/requirement/types';

export class SetManagementPriorityDto {
  @IsEnum(ManagementPriority)
  managementPriority!: ManagementPriority;
}
