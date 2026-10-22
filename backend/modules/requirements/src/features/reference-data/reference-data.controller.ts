import { Controller, Get, Query } from '@nestjs/common';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';
import { ImpactUsersDomainRepository } from '../../infrastructure/repositories/impact-users-domain.repository';

@Controller()
export class ReferenceDataController {
  constructor(
    private readonly domainRepository: DomainRepository,
    private readonly institutionRepository: InstitutionRepository,
    private readonly impactUsersDomainRepository: ImpactUsersDomainRepository,
  ) {}

  @Get('domains')
  async getDomains() {
    return this.domainRepository.find({}, { orderBy: { name: 'ASC' } });
  }

  @Get('institutions')
  async getInstitutions() {
    return this.institutionRepository.find({}, { orderBy: { name: 'ASC' } });
  }

  @Get('impact-levels')
  async getImpactLevels(
    @Query('domain_id') domainId?: string,
    @Query('domain_uuid') domainUuid?: string,
  ) {
    return this.findImpactLevels(domainId, domainUuid);
  }

  @Get('impact-users-domains')
  async getImpactUsersDomains(
    @Query('domain_id') domainId?: string,
    @Query('domain_uuid') domainUuid?: string,
  ) {
    return this.findImpactLevels(domainId, domainUuid);
  }

  private async findImpactLevels(domainId?: string, domainUuid?: string) {
    let resolvedUuid = domainUuid;

    if (!resolvedUuid && domainId) {
      const isNumeric = /^\d+$/.test(domainId);
      const domain = isNumeric
        ? await this.domainRepository.findOne({ id: Number(domainId) })
        : await this.domainRepository.findOne({ uuid: domainId });

      if (domain) {
        resolvedUuid = domain.uuid;
      }
    }

    const filter: Record<string, unknown> = {};
    if (resolvedUuid) {
      filter.domain_uuid = resolvedUuid;
    }

    return this.impactUsersDomainRepository.find(filter, {
      orderBy: { impact_number_users_level: 'ASC' },
    });
  }
}
