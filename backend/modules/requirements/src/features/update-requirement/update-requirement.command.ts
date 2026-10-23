import { Command } from '@modules/shared/domain/common/command';
import { UpdateRequirementValidator } from './update-requirement.validator';

export class UpdateRequirementCommand extends Command<{
  id: string;
  data: UpdateRequirementValidator;
}> {
  type = 'requirements.update_requirement';

  constructor(id: string, data: UpdateRequirementValidator) {
    super({ id, data }, process.env.APP_NAME!);
  }

  getBody(): Record<string, unknown> {
    return {
      id: this.payload.id,
      data: this.payload.data,
    };
  }
}
