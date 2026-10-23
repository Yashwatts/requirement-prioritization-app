import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpdateRequirementHandler } from './update-requirement.handler';
import { UpdateRequirementValidator } from './update-requirement.validator';
import { UpdateRequirementCommand } from './update-requirement.command';

@Controller('requirements/:id')
export class UpdateRequirementController {
  constructor(private readonly handler: UpdateRequirementHandler) {}

  @Put()
  async handle(
    @Param('id') id: string,
    @Body() validator: UpdateRequirementValidator,
  ) {
    const command = new UpdateRequirementCommand(id, validator);
    await this.handler.handle(command);
    return { message: 'Requirement updated successfully' };
  }
}
