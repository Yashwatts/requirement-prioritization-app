import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { StudyModality } from '../../domain/requirement/enums/study-modality.enum';
import { ComplexityEffort } from '../../domain/requirement/enums/complexity-effort.enum';
import { ClientPriority } from '../../domain/requirement/enums/client-priority.enum';
import { RequirementState } from '../../domain/requirement/enums/requirement-state.enum';
import { RequirementType } from '../../domain/requirement/enums/requirement-type.enum';

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

  @IsEnum(StudyModality)
  study_modality!: StudyModality;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  impact_number_users_id!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  impact!: number;

  @IsBoolean()
  obligation!: boolean;

  @IsBoolean()
  exist_solution_alternative!: boolean;

  @IsEnum(ComplexityEffort)
  complexity_and_effort!: ComplexityEffort;

  @IsEnum(ClientPriority)
  client_priority!: ClientPriority;

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

  @IsEnum(RequirementType)
  type!: RequirementType;

  @Transform(({ value }) => value ?? RequirementState.REGISTERED)
  @IsOptional()
  @IsEnum(RequirementState)
  status?: RequirementState;
}
