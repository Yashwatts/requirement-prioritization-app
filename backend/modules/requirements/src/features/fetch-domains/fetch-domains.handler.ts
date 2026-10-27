import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { FetchDomainsQuery } from './fetch-domains.query';

@QueryHandler(FetchDomainsQuery)
export class FetchDomainsHandler implements IQueryHandler<FetchDomainsQuery> {
  constructor(private readonly domainRepository: DomainRepository) {}

  async execute() {
    return this.domainRepository.find({}, { orderBy: { name: 'ASC' } });
  }
}
