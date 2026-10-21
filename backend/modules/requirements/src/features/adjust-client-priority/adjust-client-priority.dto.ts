import { IsEnum } from 'class-validator';
import { ClientPriority } from '../../domain/requirement/types';

export class AdjustClientPriorityDto {
  @IsEnum(ClientPriority)
  clientPriority!: ClientPriority;
}
