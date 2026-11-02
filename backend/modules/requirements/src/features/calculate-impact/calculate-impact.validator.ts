import { IsArray, IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { mapImpactLevelToNumber } from '../../domain/requirement/mappers/requirement.mapper';

export class CalculateImpactValidator {
  @IsArray()
  @IsOptional()
  benefited_institutions?: (number | string)[];

  @IsBoolean()
  obligation!: boolean;

  @IsBoolean()
  exist_solution_alternative!: boolean;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  domain_in_charge_id!: number;

  @Transform(({ value }) => mapImpactLevelToNumber(value))
  @IsInt()
  @Min(1)
  impact_number_users_id!: number;
}
