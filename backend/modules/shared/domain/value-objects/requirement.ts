export class RequirementCode {
  private constructor(public readonly value: number) {
    if (
      typeof value !== 'number' ||
      Number.isNaN(value) ||
      !Number.isInteger(value) ||
      value <= 0
    ) {
      throw new Error('Requirement code must be a positive integer.');
    }
  }

  static generate(): RequirementCode {
    return new RequirementCode(Math.floor(100000 + Math.random() * 900000));
  }

  static from(value: number): RequirementCode {
    return new RequirementCode(value);
  }

  getValue(): number {
    return this.value;
  }

  toJSON(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
