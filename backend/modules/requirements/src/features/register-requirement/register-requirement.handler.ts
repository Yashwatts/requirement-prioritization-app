import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Requirement } from '../../domain/requirement/requirement';
import { RegisterRequirementCommand } from './register-requirement.command';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { ImpactUsersRepository } from '../../infrastructure/repositories/impact-users.repository';

@CommandHandler(RegisterRequirementCommand)
export class RegisterRequirementHandler implements ICommandHandler<RegisterRequirementCommand> {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly impactUsersRepository: ImpactUsersRepository,
  ) {}

  async execute(command: RegisterRequirementCommand): Promise<Requirement> {
    const { start_date, end_date, ...requirementAttributes } = command.payload;

    const tier = await this.impactUsersRepository.findUserImpactRange(
      requirementAttributes.domain_in_charge_id,
      requirementAttributes.impact_number_users_id,
    );

    const requirement = Requirement.create({
      ...requirementAttributes,
      impact_number_users_id:
        tier?.id ?? requirementAttributes.impact_number_users_id,
      impact_users_tier: tier,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
    });

    await this.requirementRepository.save(requirement);
    return requirement;
  }
}
