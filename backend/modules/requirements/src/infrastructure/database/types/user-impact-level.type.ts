import { Type } from '@mikro-orm/core';
import { UserImpactLevel } from '../../../domain/requirement/enums/user-impact-level.enum';

export class UserImpactLevelType extends Type<UserImpactLevel, number> {
  private readonly enumMapper: Record<UserImpactLevel, number> = {
    [UserImpactLevel.LOW]: 1,
    [UserImpactLevel.MEDIUM]: 2,
    [UserImpactLevel.HIGH]: 3,
    [UserImpactLevel.VERY_HIGH]: 4,
  };

  private readonly reverseMapper: Record<number, UserImpactLevel> = {
    1: UserImpactLevel.LOW,
    2: UserImpactLevel.MEDIUM,
    3: UserImpactLevel.HIGH,
    4: UserImpactLevel.VERY_HIGH,
  };

  convertToDatabaseValue(value: UserImpactLevel): number {
    const dbValue = this.enumMapper[value];
    if (dbValue === undefined) {
      throw new Error(`Invalid UserImpactLevel value: ${value}`);
    }
    return dbValue;
  }

  convertToJSValue(value: number): UserImpactLevel {
    const jsValue = this.reverseMapper[value];
    if (jsValue === undefined) {
      throw new Error(`Invalid database value for UserImpactLevel: ${value}`);
    }
    return jsValue;
  }
}
