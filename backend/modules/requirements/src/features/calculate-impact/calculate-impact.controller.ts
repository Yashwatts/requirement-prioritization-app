import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CalculateImpactCommand } from './calculate-impact.command';
import { CalculateImpactValidator } from './calculate-impact.validator';
import { CalculateImpactResult } from './calculate-impact.handler';

@Controller('requirements/calculate-impact')
export class CalculateImpactController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async handle(
    @Body() validator: CalculateImpactValidator,
  ): Promise<CalculateImpactResult> {
    return this.commandBus.execute(new CalculateImpactCommand(validator));
  }
}
