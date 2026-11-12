import { Module } from '@nestjs/common';
import { RegisterRequirementModule } from './features/register-requirement/register-requirement.module';
import { ListRequirementsModule } from './features/list-requirements/list-requirements.module';
import { FetchDomainsModule } from './features/fetch-domains/fetch-domains.module';
import { FetchInstitutionsModule } from './features/fetch-institutions/fetch-institutions.module';
import { FetchImpactUsersModule } from './features/fetch-impact-users/fetch-impact-users.module';

@Module({
  imports: [
    RegisterRequirementModule,
    ListRequirementsModule,
    FetchDomainsModule,
    FetchInstitutionsModule,
    FetchImpactUsersModule,
  ],
})
export class RequirementsModule {}
