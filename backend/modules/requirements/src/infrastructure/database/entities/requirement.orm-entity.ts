import { Entity, PrimaryKey, Property, Enum, Index } from '@mikro-orm/core';
import {
  BenefitedInstitution,
  ClientPriority,
  ComplexityEffort,
  DomainArea,
  ManagementPriority,
  RequestingInstitution,
  RequirementState,
  RequirementType,
  StudyModality,
  UserImpactLevel,
} from '../../../domain/types';

/**
 * Pure Database Entity for MikroORM (Infrastructure Layer).
 * Belongs strictly to the 'requirements' PostgreSQL schema.
 * Contains NO business logic.
 */
@Entity({ schema: 'requirements', tableName: 'requirements' })
export class RequirementOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Index()
  @Property({ type: 'integer', unique: true })
  code!: number;

  @Property({ type: 'varchar', length: 255 })
  name!: string;

  @Property({ type: 'varchar', length: 500 })
  description!: string;

  @Enum(() => RequestingInstitution)
  requestingInstitution!: RequestingInstitution;

  @Property({ type: 'varchar', length: 255 })
  requestedBy!: string;

  @Property({ type: 'json' })
  benefitedInstitutions!: BenefitedInstitution[];

  @Property({ type: 'integer' })
  totalBenefitedInstitutions!: number;

  @Property({ type: 'boolean' })
  isObligatory!: boolean;

  @Property({ type: 'boolean' })
  hasAlternativeSolution!: boolean;

  @Property({ type: 'json' })
  studyModalities!: StudyModality[];

  @Enum(() => UserImpactLevel)
  impactUsers!: UserImpactLevel;

  @Property({ type: 'double' })
  impact!: number;

  @Enum(() => ComplexityEffort)
  complexityEffort!: ComplexityEffort;

  @Enum(() => ClientPriority)
  clientPriority!: ClientPriority;

  @Enum(() => ManagementPriority)
  managementPriority!: ManagementPriority;

  @Enum(() => DomainArea)
  domain!: DomainArea;

  @Property({ type: 'json', default: '[]' })
  collaboratorDomains: DomainArea[] = [];

  @Property({ type: 'json', default: '[]' })
  followerDomains: DomainArea[] = [];

  @Enum(() => RequirementState)
  state!: RequirementState;

  @Property({ type: 'date', nullable: true })
  startDate?: Date | null;

  @Property({ type: 'date', nullable: true })
  finishDate?: Date | null;

  @Enum(() => RequirementType)
  type!: RequirementType;

  @Property({ type: 'timestamptz' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
