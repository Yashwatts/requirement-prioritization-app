import { Body, Controller, Post } from '@nestjs/common';

import { RegisterRequirementCommand } from './register-requirement.command';
import { RegisterRequirementHandler } from './register-requirement.handler';
import { RegisterRequirementValidator } from './register-requirement.validator';

@Controller('requirements')
export class RegisterRequirementController {
  constructor(private readonly handler: RegisterRequirementHandler) {}

  @Post()
  async handle(@Body() body: RegisterRequirementValidator) {
    const command = new RegisterRequirementCommand(body);

    await this.handler.handle(command);

    return {
      message: 'Requirement registered successfully',
    };
  }
}
