import { IsEnum } from 'class-validator';
import { ClientPriority } from '../../domain/types';

export class AdjustClientPriorityDto {
  @IsEnum(ClientPriority)
  clientPriority!: ClientPriority;
}
