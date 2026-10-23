import { Body, Controller, Param, Patch } from '@nestjs/common';
import { SetManagementPriorityCommand } from './set-management-priority.command';
import { SetManagementPriorityHandler } from './set-management-priority.handler';
import { SetManagementPriorityValidator } from './set-management-priority.validator';

@Controller('requirements/:id/management-priority')
export class SetManagementPriorityController {
  constructor(private readonly handler: SetManagementPriorityHandler) {}

  @Patch()
  async handle(
    @Param('id') requirementId: string,
    @Body() validator: SetManagementPriorityValidator,
  ) {
    const command = new SetManagementPriorityCommand(requirementId, validator);
    await this.handler.handle(command);
    return {
      message: 'Management priority set successfully',
    };
  }
}
