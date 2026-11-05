import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { FetchDomainsQuery } from './fetch-domains.query';

@QueryHandler(FetchDomainsQuery)
export class FetchDomainsHandler implements IQueryHandler<FetchDomainsQuery> {
  constructor(private readonly domainRepository: DomainRepository) {}

  async execute(query: FetchDomainsQuery) {
    const domains = await this.domainRepository.findAllOrderedByName();
    const lang = query.lang ? query.lang.toLowerCase() : '';
    const isEnglish = lang.startsWith('en') || lang.includes('en_us');

    if (!isEnglish) {
      return domains;
    }

    return domains.map((domain) => {
      const enTranslation = domain.translations?.en_US;
      if (typeof enTranslation === 'string' && enTranslation.trim()) {
        return {
          id: domain.id,
          uuid: domain.uuid,
          abbreviation: domain.abbreviation,
          name: enTranslation.trim(),
          translations: domain.translations,
          email: domain.email,
        };
      }
      return domain;
    });
  }
}
