import { RequirementDomain } from './entity.domain';
import {
  ClientPriority,
  DomainArea,
  ManagementPriority,
  RequirementState,
} from './types';

export interface FindRequirementsCriteria {
  search?: string;
  domain?: DomainArea;
  state?: RequirementState;
  clientPriority?: ClientPriority;
  managementPriority?: ManagementPriority;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const REQUIREMENT_REPOSITORY_TOKEN = Symbol('IRequirementRepository');

export interface IRequirementRepository {
  getNextSequenceCode(): Promise<number>;
  save(requirement: RequirementDomain): Promise<void>;
  findById(id: string): Promise<RequirementDomain | null>;
  findByCode(code: number): Promise<RequirementDomain | null>;
  find(
    criteria: FindRequirementsCriteria,
  ): Promise<PaginatedResult<RequirementDomain>>;
  findAll(): Promise<RequirementDomain[]>;
}
