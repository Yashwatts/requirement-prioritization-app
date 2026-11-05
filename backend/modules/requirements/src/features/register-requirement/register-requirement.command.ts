import { ICommand } from '@nestjs/cqrs';
import { RegisterRequirementValidator } from './register-requirement.validator';

export class RegisterRequirementCommand implements ICommand {
  constructor(public readonly requirementData: RegisterRequirementValidator) {}
}
