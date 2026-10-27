import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ModifyClientPriorityController } from './modify-client-priority.controller';
import { ModifyClientPriorityHandler } from './modify-client-priority.handler';

@Module({
  imports: [CqrsModule],
  controllers: [ModifyClientPriorityController],
  providers: [ModifyClientPriorityHandler],
})
export class ModifyClientPriorityModule {}
