import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CalculateImpactController } from './calculate-impact.controller';
import { CalculateImpactHandler } from './calculate-impact.handler';
import { RequirementsRepositoryModule } from '../../infrastructure/repositories/requirements-repository.module';

@Module({
  imports: [CqrsModule, RequirementsRepositoryModule],
  controllers: [CalculateImpactController],
  providers: [CalculateImpactHandler],
})
export class CalculateImpactModule {}
