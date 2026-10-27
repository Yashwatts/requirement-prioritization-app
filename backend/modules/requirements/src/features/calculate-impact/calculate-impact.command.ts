import { ICommand } from '@nestjs/cqrs';
import { CalculateImpactValidator } from './calculate-impact.validator';

export class CalculateImpactCommand implements ICommand {
  constructor(public readonly payload: CalculateImpactValidator) {}
}
