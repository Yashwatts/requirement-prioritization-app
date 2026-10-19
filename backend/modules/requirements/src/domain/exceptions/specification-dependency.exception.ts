import { DomainException } from './domain.exception';

export class SpecificationDependencyException extends DomainException {
  readonly status = 422;
  readonly title = 'Unresolved Specification Dependency';
  readonly type = 'urn:problem-type:unresolved-specification-dependency';

  constructor(
    message = 'Cannot calculate Impact: numeric contribution for Impact Users by Domain is not defined in the SRS specification.',
  ) {
    super(message);
  }
}
