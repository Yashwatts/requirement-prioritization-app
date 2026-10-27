import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';
import { FetchInstitutionsQuery } from './fetch-institutions.query';

@QueryHandler(FetchInstitutionsQuery)
export class FetchInstitutionsHandler implements IQueryHandler<FetchInstitutionsQuery> {
  constructor(private readonly institutionRepository: InstitutionRepository) {}

  async execute() {
    return this.institutionRepository.find({}, { orderBy: { name: 'ASC' } });
  }
}
