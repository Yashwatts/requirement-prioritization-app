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
    @Body() modifyClientPriorityValidator: ModifyClientPriorityValidator,
  ) {
    const command =  new ModifyClientPriorityCommand(requirementId, modifyClientPriorityValidator)
    await this.commandBus.execute(command);
    return {
      message: 'Client priority modified successfully',
    };
  }
}
