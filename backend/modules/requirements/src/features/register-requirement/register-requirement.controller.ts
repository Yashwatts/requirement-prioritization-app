import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterRequirementCommand } from './register-requirement.command';
import { RegisterRequirementValidator } from './register-requirement.validator';

@Controller('requirements')
export class RegisterRequirementController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async handle(@Body() validator: RegisterRequirementValidator) {
    await this.commandBus.execute(new RegisterRequirementCommand(validator));
    return {
      message: 'Requisition registered successfully',
    };
  }
}
