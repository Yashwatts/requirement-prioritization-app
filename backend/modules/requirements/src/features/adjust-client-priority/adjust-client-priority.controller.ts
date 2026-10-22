import { Body, Controller, Param, Patch } from '@nestjs/common';

import { AdjustClientPriorityHandler } from './adjust-client-priority.handler';
import { AdjustClientPriorityCommand } from './adjust-client-priority.command';
import { AdjustClientPriorityValidator } from './adjust-client-priority.validator';

@Controller('requirements')
export class AdjustClientPriorityController {
  constructor(private readonly handler: AdjustClientPriorityHandler) {}

  @Patch(':id/client-priority')
  async handle(
    @Param('id') requirementId: string,
    @Body() body: AdjustClientPriorityValidator,
  ) {
    const command = new AdjustClientPriorityCommand(requirementId, body);

    await this.handler.handle(command);

    return {
      message: 'Client priority adjusted successfully',
    };
  }
}
