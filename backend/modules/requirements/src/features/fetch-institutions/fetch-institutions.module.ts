import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FetchInstitutionsController } from './fetch-institutions.controller';
import { FetchInstitutionsHandler } from './fetch-institutions.handler';

@Module({
  imports: [CqrsModule],
  controllers: [FetchInstitutionsController],
  providers: [FetchInstitutionsHandler],
})
export class FetchInstitutionsModule {}
