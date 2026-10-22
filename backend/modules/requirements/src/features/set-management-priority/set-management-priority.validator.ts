import { IsEnum, IsNotEmpty } from 'class-validator';
import { ManagementPriority } from '../../domain/requirement/enums/management-priority.enum';

export class SetManagementPriorityValidator {
  @IsEnum(ManagementPriority)
  @IsNotEmpty()
  management_priority!: ManagementPriority;
}
