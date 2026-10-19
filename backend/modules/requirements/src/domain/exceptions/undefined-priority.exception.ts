import { DomainException } from './domain.exception';

export class UndefinedPriorityException extends DomainException {
  readonly status = 422;
  readonly title = 'Undefined Priority Range';
  readonly type = 'urn:problem-type:undefined-priority-range';

  constructor(impact: number) {
    super(
      `Client priority is undefined for Impact score ${impact}. The specification only defines (0, 10), (10, 20), and > 20.`,
    );
  }
}
