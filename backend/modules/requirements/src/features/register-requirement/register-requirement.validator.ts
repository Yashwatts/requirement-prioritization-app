import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { StudyModality } from '../../domain/requirement/enums/study-modality.enum';
import { ComplexityEffort } from '../../domain/requirement/enums/complexity-effort.enum';
import { ClientPriority } from '../../domain/requirement/enums/client-priority.enum';
import { RequirementState } from '../../domain/requirement/enums/requirement-state.enum';
import { RequirementType } from '../../domain/requirement/enums/requirement-type.enum';
import {
  mapClientPriorityToNumber,
  mapComplexityToNumber,
  mapImpactLevelToNumber,
  mapModalityToNumber,
  mapStatusToNumber,
  mapTypeToNumber,
} from '../../domain/requirement/mappers/requirement.mapper';

export class RegisterRequirementValidator {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(250)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description!: string;

  @IsInt()
  @Min(1)
  requesting_institution_id!: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  requested_by!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  benefited_institutions!: string[];

  @Transform(({ value }) => mapModalityToNumber(value))
  @IsEnum(StudyModality)
  study_modality!: StudyModality;

  @Transform(({ value }) => mapImpactLevelToNumber(value))
  @IsInt()
  @Min(1)
  impact_number_users_id!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  impact_users_value?: number;

  @IsBoolean()
  obligation!: boolean;

  @IsBoolean()
  exist_solution_alternative!: boolean;

  @Transform(({ value }) => mapComplexityToNumber(value))
  @IsEnum(ComplexityEffort)
  complexity_and_effort!: ComplexityEffort;

  @Transform(({ value }) =>
    value ? mapClientPriorityToNumber(value) : undefined,
  )
  @IsOptional()
  @IsEnum(ClientPriority)
  client_priority?: ClientPriority;

  @IsInt()
  @Min(1)
  domain_in_charge_id!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  domains_collaborators?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  followers_domains?: string[];

  @IsOptional()
  @IsInt()
  development_time_in_sprints?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @Transform(({ value }) => mapTypeToNumber(value))
  @IsEnum(RequirementType)
  type!: RequirementType;

  @Transform(({ value }) =>
    value ? mapStatusToNumber(value) : RequirementState.REGISTERED,
  )
  @IsOptional()
  @IsEnum(RequirementState)
  status?: RequirementState;
}
