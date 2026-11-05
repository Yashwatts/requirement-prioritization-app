import { Type } from '@mikro-orm/core';
import { RequirementState } from '../../../domain/requirement/enums/requirement-state.enum';

export class RequirementStateType extends Type<RequirementState, number> {
  private readonly enumMapper: Record<RequirementState, number> = {
    [RequirementState.REGISTERED]: 1,
    [RequirementState.FLOW]: 2,
  };

  private readonly reverseMapper: Record<number, RequirementState> = {
    1: RequirementState.REGISTERED,
    2: RequirementState.FLOW,
  };

  convertToDatabaseValue(value: RequirementState): number {
    const dbValue = this.enumMapper[value];
    if (dbValue === undefined) {
      throw new Error(`Invalid RequirementState value: ${value}`);
    }
    return dbValue;
  }

  convertToJSValue(value: number): RequirementState {
    const jsValue = this.reverseMapper[value];
    if (jsValue === undefined) {
      throw new Error(`Invalid database value for RequirementState: ${value}`);
    }
    return jsValue;
  }
}
