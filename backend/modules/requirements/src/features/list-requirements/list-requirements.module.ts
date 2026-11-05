import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ListRequirementsController } from './list-requirements.controller';
import { ListRequirementsHandler } from './list-requirements.handler';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { ImpactUsersRepository } from '../../infrastructure/repositories/impact-users.repository';

@Module({
  imports: [CqrsModule],
  controllers: [ListRequirementsController],
  providers: [
    ListRequirementsHandler,
    RequirementRepository,
    InstitutionRepository,
    DomainRepository,
    ImpactUsersRepository,
  ],
})
export class ListRequirementsModule {}
