import { Module } from '@nestjs/common';

import { RegisterRequirementModule } from './features/register-requirement/register-requirement.module';
import { AdjustClientPriorityModule } from './features/adjust-client-priority/adjust-client-priority.module';
import { SetManagementPriorityModule } from './features/set-management-priority/set-management-priority.module';
import { ListRequirementsModule } from './features/list-requirements/list-requirements.module';
import { GetRequirementModule } from './features/get-requirement/get-requirement.module';
import { UpdateRequirementModule } from './features/update-requirement/update-requirement.module';
import { ReferenceDataModule } from './features/reference-data/reference-data.module';
import { RequirementsMessageDestinationModule } from './infrastructure/message-bus/requirements-message-destination.module';

@Module({
  imports: [
    RequirementsMessageDestinationModule,
    RegisterRequirementModule,
    AdjustClientPriorityModule,
    SetManagementPriorityModule,
    ListRequirementsModule,
    GetRequirementModule,
    UpdateRequirementModule,
    ReferenceDataModule,
  ],
})
export class RequirementsModule {}
