import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ModifyClientPriorityController } from './modify-client-priority.controller';
import { ModifyClientPriorityHandler } from './modify-client-priority.handler';
import { RequirementRepository } from '../../infrastructure/repositories/requirement.repository';

@Module({
  imports: [CqrsModule],
  controllers: [ModifyClientPriorityController],
  providers: [ModifyClientPriorityHandler, RequirementRepository],
})
export class ModifyClientPriorityModule {}
