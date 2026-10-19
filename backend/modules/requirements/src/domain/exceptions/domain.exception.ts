import { ProblemDetails } from './problem-details.interface';

/**
 * Base abstract domain exception class extending Error.
 * All business rule and invariant failures in the domain extend this class.
 */
export abstract class DomainException extends Error {
  abstract readonly status: number;
  abstract readonly title: string;
  abstract readonly type: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toProblemDetails(instance?: string): ProblemDetails {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.message,
      instance,
    };
  }
}
