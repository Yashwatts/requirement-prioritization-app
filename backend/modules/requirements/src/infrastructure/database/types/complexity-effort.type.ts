import { Type } from '@mikro-orm/core';
import { ComplexityEffort } from '../../../domain/requirement/enums/complexity-effort.enum';

export class ComplexityEffortType extends Type<ComplexityEffort, number> {
  private readonly enumMapper: Record<ComplexityEffort, number> = {
    [ComplexityEffort.XS]: 1,
    [ComplexityEffort.S]: 2,
    [ComplexityEffort.M]: 3,
    [ComplexityEffort.L]: 4,
    [ComplexityEffort.XL]: 5,
  };

  private readonly reverseMapper: Record<number, ComplexityEffort> = {
    1: ComplexityEffort.XS,
    2: ComplexityEffort.S,
    3: ComplexityEffort.M,
    4: ComplexityEffort.L,
    5: ComplexityEffort.XL,
  };

  convertToDatabaseValue(value: ComplexityEffort): number {
    const dbValue = this.enumMapper[value];
    if (dbValue === undefined) {
      throw new Error(`Invalid ComplexityEffort value: ${value}`);
    }
    return dbValue;
  }

  convertToJSValue(value: number): ComplexityEffort {
    const jsValue = this.reverseMapper[value];
    if (jsValue === undefined) {
      throw new Error(`Invalid database value for ComplexityEffort: ${value}`);
    }
    return jsValue;
  }
}
