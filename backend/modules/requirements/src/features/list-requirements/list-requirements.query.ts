import { IQuery } from '@nestjs/cqrs';
import { ListRequirementsQueryParams } from './list-requirements.validator';

export class ListRequirementsQuery implements IQuery {
  constructor(
    public readonly params: ListRequirementsQueryParams,
    public readonly lang?: string,
  ) {}
}
