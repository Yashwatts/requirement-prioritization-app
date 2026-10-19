import { DomainException } from './domain.exception';

export class InvalidStateTransitionException extends DomainException {
  readonly status = 422;
  readonly title = 'Invalid State Transition';
  readonly type = 'urn:problem-type:invalid-state-transition';

  constructor(
    message = 'Cannot transition state: requirement is in a terminal state.',
  ) {
    super(message);
  }
}
