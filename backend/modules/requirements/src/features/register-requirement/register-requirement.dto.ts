import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  BenefitedInstitution,
  ClientPriority,
  ComplexityEffort,
  DomainArea,
  ManagementPriority,
  RequestingInstitution,
  RequirementType,
  StudyModality,
  UserImpactLevel,
} from '../../domain/requirement/types';

export class RegisterRequirementDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description!: string;

  @IsEnum(RequestingInstitution)
  requestingInstitution!: RequestingInstitution;

  @IsString()
  @IsNotEmpty()
  requestedBy!: string;

  @IsEnum(RequirementType)
  type!: RequirementType;

  @IsEnum(DomainArea)
  domain!: DomainArea;

  @IsArray()
  @IsEnum(BenefitedInstitution, { each: true })
  benefitedInstitutions!: BenefitedInstitution[];

  @IsArray()
  @IsEnum(StudyModality, { each: true })
  studyModalities!: StudyModality[];

  @IsBoolean()
  isObligatory!: boolean;

  @IsBoolean()
  hasAlternativeSolution!: boolean;

  @IsEnum(UserImpactLevel)
  impactUsers!: UserImpactLevel;

  @IsEnum(ComplexityEffort)
  complexityEffort!: ComplexityEffort;

  @IsOptional()
  @IsArray()
  @IsEnum(DomainArea, { each: true })
  collaboratorDomains?: DomainArea[];

  @IsOptional()
  @IsArray()
  @IsEnum(DomainArea, { each: true })
  followerDomains?: DomainArea[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  finishDate?: string;

  @IsOptional()
  @IsEnum(ClientPriority)
  clientPriorityOverride?: ClientPriority;

  @IsOptional()
  @IsEnum(ManagementPriority)
  managementPriority?: ManagementPriority;

  @IsOptional()
  @IsNumber()
  impactUsersNumericContribution?: number;

  @IsOptional()
  @IsNumber()
  impactOverride?: number;
}
