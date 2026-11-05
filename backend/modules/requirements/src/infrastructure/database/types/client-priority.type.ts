import { Type } from '@mikro-orm/core';
import { ClientPriority } from '../../../domain/requirement/enums/client-priority.enum';

export class ClientPriorityType extends Type<ClientPriority, number> {
  private readonly enumMapper: Record<ClientPriority, number> = {
    [ClientPriority.LOW]: 1,
    [ClientPriority.MEDIUM]: 2,
    [ClientPriority.HIGH]: 3,
  };

  private readonly reverseMapper: Record<number, ClientPriority> = {
    1: ClientPriority.LOW,
    2: ClientPriority.MEDIUM,
    3: ClientPriority.HIGH,
  };

  convertToDatabaseValue(value: ClientPriority): number {
    const dbValue = this.enumMapper[value];
    if (dbValue === undefined) {
      throw new Error(`Invalid ClientPriority value: ${value}`);
    }
    return dbValue;
  }

  convertToJSValue(value: number): ClientPriority {
    const jsValue = this.reverseMapper[value];
    if (jsValue === undefined) {
      throw new Error(`Invalid database value for ClientPriority: ${value}`);
    }
    return jsValue;
  }
}
