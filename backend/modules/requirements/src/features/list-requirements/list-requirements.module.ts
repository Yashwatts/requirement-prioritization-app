import { Module } from '@nestjs/common';
import { ListRequirementsController } from './list-requirements.controller';
import { ListRequirementsHandler } from './list-requirements.handler';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';

@Module({
  controllers: [ListRequirementsController],
  providers: [
    ListRequirementsHandler,
    RequirementRepository,
    InstitutionRepository,
    DomainRepository,
  ],
})
export class ListRequirementsModule {}
