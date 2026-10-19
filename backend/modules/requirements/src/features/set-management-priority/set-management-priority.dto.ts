import { IsEnum } from 'class-validator';
import { ManagementPriority } from '../../domain/types';

export class SetManagementPriorityDto {
  @IsEnum(ManagementPriority)
  managementPriority!: ManagementPriority;
}
