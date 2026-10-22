import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpdateRequirementHandler } from './update-requirement.handler';
import { UpdateRequirementValidator } from './update-requirement.validator';
import { UpdateRequirementCommand } from './update-requirement.command';

@Controller('requirements')
export class UpdateRequirementController {
  constructor(private readonly handler: UpdateRequirementHandler) {}

  @Put(':id')
  async handle(
    @Param('id') id: string,
    @Body() body: UpdateRequirementValidator,
  ) {
    const command = new UpdateRequirementCommand(id, body);
    await this.handler.handle(command);
    return { message: 'Requirement updated successfully' };
  }
}
