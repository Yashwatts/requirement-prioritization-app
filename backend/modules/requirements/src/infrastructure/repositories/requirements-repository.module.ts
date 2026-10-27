import { Module, Global } from '@nestjs/common';
import { RequirementRepository } from './requirement.repository';
import { InstitutionRepository } from './institution.repository';
import { DomainRepository } from './domain.repository';
import { ImpactUsersRepository } from './impact-users.repository';

const REPOSITORIES = [
  RequirementRepository,
  InstitutionRepository,
  DomainRepository,
  ImpactUsersRepository,
];

@Global()
@Module({
  providers: [...REPOSITORIES],
  exports: [...REPOSITORIES],
})
export class RequirementsRepositoryModule {}
