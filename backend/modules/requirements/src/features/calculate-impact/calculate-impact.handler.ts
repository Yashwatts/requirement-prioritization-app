import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CalculateImpactCommand } from './calculate-impact.command';
import { Requirement } from '../../domain/requirement/requirement';
import { ImpactUsersRepository } from '../../infrastructure/repositories/impact-users.repository';
import { ClientPriority } from '../../domain/requirement/enums/client-priority.enum';

export interface CalculateImpactResult {
  impact: number;
  client_priority: ClientPriority;
  client_priority_name: 'Low' | 'Medium' | 'High';
}

@CommandHandler(CalculateImpactCommand)
export class CalculateImpactHandler implements ICommandHandler<
  CalculateImpactCommand,
  CalculateImpactResult
> {
  constructor(private readonly impactUsersRepository: ImpactUsersRepository) {}

  async execute(
    command: CalculateImpactCommand,
  ): Promise<CalculateImpactResult> {
    const {
      benefited_institutions,
      obligation,
      exist_solution_alternative,
      domain_in_charge_id,
      impact_number_users_id,
    } = command.payload;

    const userImpactRange =
      await this.impactUsersRepository.findUserImpactRange(
        domain_in_charge_id,
        impact_number_users_id,
      );

    const userImpactValue =
      userImpactRange?.getAverageQuantity() ?? impact_number_users_id;

    const totalBenefited = benefited_institutions?.length ?? 0;

    const impact = Requirement.calculateImpactValue({
      total_benefited_institutions: totalBenefited,
      obligation: Boolean(obligation),
      exist_solution_alternative: Boolean(exist_solution_alternative),
      user_impact_value: userImpactValue,
    });

    const clientPriority =
      Requirement.calculateClientPriorityFromImpact(impact);

    const clientPriorityName: 'Low' | 'Medium' | 'High' =
      clientPriority === ClientPriority.LOW
        ? 'Low'
        : clientPriority === ClientPriority.MEDIUM
          ? 'Medium'
          : 'High';

    return {
      impact,
      client_priority: clientPriority,
      client_priority_name: clientPriorityName,
    };
  }
}
