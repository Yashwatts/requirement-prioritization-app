import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AdjustClientPriorityCommand } from './adjust-client-priority.command';
import { AdjustClientPriorityDto } from './adjust-client-priority.dto';

@Controller('requirements')
export class AdjustClientPriorityController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/client-priority')
  @HttpCode(HttpStatus.NO_CONTENT)
  async adjustClientPriority(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdjustClientPriorityDto,
  ): Promise<void> {
    await this.commandBus.execute<AdjustClientPriorityCommand, void>(
      new AdjustClientPriorityCommand(id, dto.clientPriority),
    );
  }
}
