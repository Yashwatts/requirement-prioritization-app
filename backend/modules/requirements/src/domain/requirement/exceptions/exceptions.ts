export class RequirementNotFound extends Error {
  constructor() {
    super(`Requirement not found.`);
    this.name = 'RequirementNotFound';
  }
}

export class InvalidRequirement extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRequirement';
  }
}

export class InvalidClientPriority extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidClientPriority';
  }
}
