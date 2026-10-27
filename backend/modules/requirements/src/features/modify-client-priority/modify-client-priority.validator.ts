import { IsEnum, IsNotEmpty } from 'class-validator';
import { ClientPriority } from '../../domain/requirement/enums/client-priority.enum';

export class ModifyClientPriorityValidator {
  @IsEnum(ClientPriority)
  @IsNotEmpty()
  client_priority!: ClientPriority;
}
