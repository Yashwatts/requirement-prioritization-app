import { IQuery } from '@nestjs/cqrs';

export class GetRequirementQuery implements IQuery {
  constructor(public readonly id: string) {}
}
