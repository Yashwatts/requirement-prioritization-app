import { Type } from '@mikro-orm/core';

import { OutBoxStatus } from '../enums/outbox-status.enum';

export class OutBoxStatusMapper extends Type<OutBoxStatus, number> {
  private readonly mapper: Record<OutBoxStatus, number> = {
    [OutBoxStatus.PENDING]: 0,
    [OutBoxStatus.SENT]: 1,
  };

  convertToDatabaseValue(value: OutBoxStatus): number {
    return this.mapper[value];
  }

  convertToJSValue(value: number): OutBoxStatus {
    const member = Object.keys(this.mapper).find(
      (key) => this.mapper[key as OutBoxStatus] === value,
    );

    if (!member) {
      throw new Error(`Invalid OutBoxStatus database value: ${value}`);
    }

    return member as OutBoxStatus;
  }
}
