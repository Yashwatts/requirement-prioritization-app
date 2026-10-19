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
import { SetManagementPriorityCommand } from './set-management-priority.command';
import { SetManagementPriorityDto } from './set-management-priority.dto';

@Controller('requirements')
export class SetManagementPriorityController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/management-priority')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setManagementPriority(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetManagementPriorityDto,
  ): Promise<void> {
    await this.commandBus.execute<SetManagementPriorityCommand, void>(
      new SetManagementPriorityCommand(id, dto.managementPriority),
    );
  }
}
