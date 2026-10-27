import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ListRequirementsController } from './list-requirements.controller';
import { ListRequirementsHandler } from './list-requirements.handler';

@Module({
  imports: [CqrsModule],
  controllers: [ListRequirementsController],
  providers: [ListRequirementsHandler],
})
export class ListRequirementsModule {}
