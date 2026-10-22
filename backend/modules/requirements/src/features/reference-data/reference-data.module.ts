import { Module } from '@nestjs/common';
import { ReferenceDataController } from './reference-data.controller';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';
import { ImpactUsersDomainRepository } from '../../infrastructure/repositories/impact-users-domain.repository';

@Module({
  controllers: [ReferenceDataController],
  providers: [
    DomainRepository,
    InstitutionRepository,
    ImpactUsersDomainRepository,
  ],
})
export class ReferenceDataModule {}
