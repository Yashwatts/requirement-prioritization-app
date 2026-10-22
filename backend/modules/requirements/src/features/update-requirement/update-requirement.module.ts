import { Module } from '@nestjs/common';
import { UpdateRequirementController } from './update-requirement.controller';
import { UpdateRequirementHandler } from './update-requirement.handler';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';
import { ImpactUsersDomainRepository } from '../../infrastructure/repositories/impact-users-domain.repository';

@Module({
  controllers: [UpdateRequirementController],
  providers: [
    UpdateRequirementHandler,
    RequirementRepository,
    ImpactUsersDomainRepository,
  ],
})
export class UpdateRequirementModule {}
