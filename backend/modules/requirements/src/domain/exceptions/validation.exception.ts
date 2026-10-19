import { DomainException } from './domain.exception';

export class ValidationDomainException extends DomainException {
  readonly status = 422;
  readonly title = 'Unprocessable Entity';
  readonly type = 'urn:problem-type:validation-error';

  constructor(message: string) {
    super(message);
  }
}
