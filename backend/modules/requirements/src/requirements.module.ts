import { Module } from '@nestjs/common';
import { RequirementsRepositoryModule } from './infrastructure/repositories/requirements-repository.module';
import { RegisterRequirementModule } from './features/register-requirement/register-requirement.module';
import { ModifyClientPriorityModule } from './features/modify-client-priority/modify-client-priority.module';
import { ListRequirementsModule } from './features/list-requirements/list-requirements.module';
import { FetchDomainsModule } from './features/fetch-domains/fetch-domains.module';
import { FetchInstitutionsModule } from './features/fetch-institutions/fetch-institutions.module';
import { FetchImpactUsersModule } from './features/fetch-impact-users/fetch-impact-users.module';
import { CalculateImpactModule } from './features/calculate-impact/calculate-impact.module';

@Module({
  imports: [
    RequirementsRepositoryModule,
    CalculateImpactModule,
    RegisterRequirementModule,
    ModifyClientPriorityModule,
    ListRequirementsModule,
    FetchDomainsModule,
    FetchInstitutionsModule,
    FetchImpactUsersModule,
  ],
})
export class RequirementsModule {}
