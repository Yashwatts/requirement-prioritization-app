import { DomainException } from './domain.exception';

export class RequirementNotFoundException extends DomainException {
  readonly status = 404;
  readonly title = 'Requirement Not Found';
  readonly type = 'urn:problem-type:resource-not-found';

  constructor(id: string) {
    super(`Requirement with id '${id}' was not found.`);
  }
}
