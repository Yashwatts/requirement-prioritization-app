import { IQuery } from '@nestjs/cqrs';
import {
  ClientPriority,
  DomainArea,
  ManagementPriority,
  RequirementState,
} from '../../domain/requirement/types';

export class ListRequirementsQuery implements IQuery {
  constructor(
    public readonly search: string | undefined,
    public readonly domain: DomainArea | undefined,
    public readonly state: RequirementState | undefined,
    public readonly clientPriority: ClientPriority | undefined,
    public readonly managementPriority: ManagementPriority | undefined,
    public readonly sortBy: string | undefined,
    public readonly sortOrder: 'ASC' | 'DESC' | undefined,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
