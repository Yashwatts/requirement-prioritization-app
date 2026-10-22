import { Body, Controller, Param, Patch } from '@nestjs/common';
import { SetManagementPriorityCommand } from './set-management-priority.command';
import { SetManagementPriorityHandler } from './set-management-priority.handler';
import { SetManagementPriorityValidator } from './set-management-priority.validator';

@Controller('requirements')
export class SetManagementPriorityController {
  constructor(private readonly handler: SetManagementPriorityHandler) {}

  @Patch(':id/management-priority')
  async handle(
    @Param('id') requirementId: string,
    @Body() body: SetManagementPriorityValidator,
  ) {
    const command = new SetManagementPriorityCommand(requirementId, body);

    await this.handler.handle(command);

    return {
      message: 'Management priority set successfully',
    };
  }
}
