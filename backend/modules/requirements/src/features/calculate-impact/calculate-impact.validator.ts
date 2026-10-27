import { IsArray, IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CalculateImpactValidator {
  @IsArray()
  @IsOptional()
  benefited_institutions?: string[];

  @IsBoolean()
  obligation!: boolean;

  @IsBoolean()
  exist_solution_alternative!: boolean;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  domain_in_charge_id!: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  impact_number_users_id!: number;
}
