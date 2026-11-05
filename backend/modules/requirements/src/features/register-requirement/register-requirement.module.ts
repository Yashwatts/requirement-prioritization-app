import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterRequirementController } from './register-requirement.controller';
import { RegisterRequirementHandler } from './register-requirement.handler';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';

@Module({
  imports: [CqrsModule],
  controllers: [RegisterRequirementController],
  providers: [
    RegisterRequirementHandler,
    RequirementRepository,
    DomainRepository,
  ],
})
export class RegisterRequirementModule {}
