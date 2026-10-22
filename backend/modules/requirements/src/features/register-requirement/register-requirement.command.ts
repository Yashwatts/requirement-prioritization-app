import { RegisterRequirementValidator } from './register-requirement.validator';

export class RegisterRequirementCommand {
  constructor(public readonly payload: RegisterRequirementValidator) {}
}
