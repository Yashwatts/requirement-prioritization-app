import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';

// Infrastructure
import { RequirementOrmEntity } from './infrastructure/database/entities/requirement.orm-entity';
import { RequirementRepository } from './infrastructure/database/repositories/requirement.repository';
import { REQUIREMENT_REPOSITORY_TOKEN } from './domain/requirement.repository.interface';

// Feature: Register Requirement
import { RegisterRequirementController } from './features/register-requirement/register-requirement.controller';
import { RegisterRequirementHandler } from './features/register-requirement/register-requirement.handler';

// Feature: List Requirements
import { ListRequirementsController } from './features/list-requirements/list-requirements.controller';
import { ListRequirementsHandler } from './features/list-requirements/list-requirements.handler';

// Feature: Get Requirement
import { GetRequirementController } from './features/get-requirement/get-requirement.controller';
import { GetRequirementHandler } from './features/get-requirement/get-requirement.handler';

// Feature: Adjust Client Priority
import { AdjustClientPriorityController } from './features/adjust-client-priority/adjust-client-priority.controller';
import { AdjustClientPriorityHandler } from './features/adjust-client-priority/adjust-client-priority.handler';

// Feature: Set Management Priority
import { SetManagementPriorityController } from './features/set-management-priority/set-management-priority.controller';
import { SetManagementPriorityHandler } from './features/set-management-priority/set-management-priority.handler';

const CommandHandlers = [
  RegisterRequirementHandler,
  AdjustClientPriorityHandler,
  SetManagementPriorityHandler,
];

const QueryHandlers = [ListRequirementsHandler, GetRequirementHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([RequirementOrmEntity])],
  controllers: [
    RegisterRequirementController,
    ListRequirementsController,
    GetRequirementController,
    AdjustClientPriorityController,
    SetManagementPriorityController,
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: REQUIREMENT_REPOSITORY_TOKEN,
      useClass: RequirementRepository,
    },
  ],
})
export class RequirementsModule {}
