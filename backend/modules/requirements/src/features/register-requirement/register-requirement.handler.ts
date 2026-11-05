import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Requirement } from '../../domain/requirement/requirement';
import { RegisterRequirementCommand } from './register-requirement.command';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';

@CommandHandler(RegisterRequirementCommand)
export class RegisterRequirementHandler implements ICommandHandler<RegisterRequirementCommand> {
  constructor(
    private readonly requirementRepository: RequirementRepository,
    private readonly domainRepository: DomainRepository,
  ) {}

  async execute(command: RegisterRequirementCommand): Promise<Requirement> {
    const { start_date, end_date, ...requirementAttributes } =
      command.requirementData;

    const domain = await this.domainRepository.findById(
      requirementAttributes.domain_in_charge_id,
    );
    if (!domain) {
      throw new Error(
        `Domain with id ${requirementAttributes.domain_in_charge_id} not found`,
      );
    }

    const requirement = Requirement.create({
      ...requirementAttributes,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
    });

    await this.requirementRepository.save(requirement);
    return requirement;
  }
}
