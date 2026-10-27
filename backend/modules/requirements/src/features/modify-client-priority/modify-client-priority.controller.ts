import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ModifyClientPriorityCommand } from './modify-client-priority.command';
import { ModifyClientPriorityValidator } from './modify-client-priority.validator';

@Controller('requirements/:id/client-priority')
export class ModifyClientPriorityController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  async handle(
    @Param('id') requirementId: string,
    @Body() validator: ModifyClientPriorityValidator,
  ) {
    await this.commandBus.execute(
      new ModifyClientPriorityCommand(requirementId, validator),
    );
    return {
      message: 'Client priority modified successfully',
    };
  }
}
