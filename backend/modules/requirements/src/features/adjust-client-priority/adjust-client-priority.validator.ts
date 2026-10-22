import { IsEnum, IsNotEmpty } from 'class-validator';
import { ClientPriority } from '../../domain/requirement/enums/client-priority.enum';

export class AdjustClientPriorityValidator {
  @IsEnum(ClientPriority)
  @IsNotEmpty()
  client_priority!: ClientPriority;
}
