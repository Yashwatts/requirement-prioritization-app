import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FetchInstitutionsController } from './fetch-institutions.controller';
import { FetchInstitutionsHandler } from './fetch-institutions.handler';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';

@Module({
  imports: [CqrsModule],
  controllers: [FetchInstitutionsController],
  providers: [FetchInstitutionsHandler, InstitutionRepository],
})
export class FetchInstitutionsModule {}
