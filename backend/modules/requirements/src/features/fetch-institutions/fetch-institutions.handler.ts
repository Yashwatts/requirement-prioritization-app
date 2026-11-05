import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InstitutionRepository } from '../../infrastructure/repositories/institution.repository';
import { FetchInstitutionsQuery } from './fetch-institutions.query';
import { Institution } from '../../domain/requirement/institution/institution';

@QueryHandler(FetchInstitutionsQuery)
export class FetchInstitutionsHandler implements IQueryHandler<FetchInstitutionsQuery, Institution[]> {
  constructor(private readonly institutionRepository: InstitutionRepository) {}

  async execute(): Promise<Institution[]> {
    return this.institutionRepository.findAllOrderedByName();
  }
}
