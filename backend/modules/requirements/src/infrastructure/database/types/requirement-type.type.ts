import { Type } from '@mikro-orm/core';
import { RequirementType } from '../../../domain/requirement/enums/requirement-type.enum';

export class RequirementTypeType extends Type<RequirementType, number> {
  private readonly enumMapper: Record<RequirementType, number> = {
    [RequirementType.INTERNAL]: 1,
    [RequirementType.EXTERNAL]: 2,
    [RequirementType.CLIENT]: 3,
  };

  private readonly reverseMapper: Record<number, RequirementType> = {
    1: RequirementType.INTERNAL,
    2: RequirementType.EXTERNAL,
    3: RequirementType.CLIENT,
  };

  convertToDatabaseValue(value: RequirementType): number {
    const dbValue = this.enumMapper[value];
    if (dbValue === undefined) {
      throw new Error(`Invalid RequirementType value: ${value}`);
    }
    return dbValue;
  }

  convertToJSValue(value: number): RequirementType {
    const jsValue = this.reverseMapper[value];
    if (jsValue === undefined) {
      throw new Error(`Invalid database value for RequirementType: ${value}`);
    }
    return jsValue;
  }
}
