import { Module } from '@nestjs/common';
import { GetRequirementController } from './get-requirement.controller';
import { GetRequirementHandler } from './get-requirement.handler';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';

@Module({
  controllers: [GetRequirementController],
  providers: [
    GetRequirementHandler,
    RequirementRepository,
    InstitutionRepository,
    DomainRepository,
  ],
})
export class GetRequirementModule {}
