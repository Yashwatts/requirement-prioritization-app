import { UnauthorizedException } from '@nestjs/common';
import { ProblemDetailsMapper } from './problem-details.mapper';
import { ValidationDomainException } from './validation.exception';
import { SpecificationDependencyException } from './specification-dependency.exception';
import { UndefinedPriorityException } from './undefined-priority.exception';
import { RequirementNotFoundException } from './requirement-not-found.exception';
import { InvalidStateTransitionException } from './invalid-state-transition.exception';

describe('ProblemDetailsMapper', () => {
  const testUrl = '/api/requirements';

  it('should map ValidationDomainException to RFC 7807 problem details with status 422', () => {
    const error = new ValidationDomainException(
      'Requirement name is mandatory and cannot be empty.',
    );
    const problem = ProblemDetailsMapper.toProblemDetails(error, testUrl);

    expect(problem.status).toBe(422);
    expect(problem.title).toBe('Unprocessable Entity');
    expect(problem.type).toBe('urn:problem-type:validation-error');
    expect(problem.detail).toBe(
      'Requirement name is mandatory and cannot be empty.',
    );
    expect(problem.instance).toBe(testUrl);
  });

  it('should map SpecificationDependencyException to RFC 7807 problem details with status 422', () => {
    const error = new SpecificationDependencyException();
    const problem = ProblemDetailsMapper.toProblemDetails(error, testUrl);

    expect(problem.status).toBe(422);
    expect(problem.title).toBe('Unresolved Specification Dependency');
    expect(problem.type).toBe(
      'urn:problem-type:unresolved-specification-dependency',
    );
    expect(problem.detail).toContain('numeric contribution for Impact Users');
    expect(problem.instance).toBe(testUrl);
  });

  it('should map UndefinedPriorityException to RFC 7807 problem details with status 422', () => {
    const error = new UndefinedPriorityException(10);
    const problem = ProblemDetailsMapper.toProblemDetails(error, testUrl);

    expect(problem.status).toBe(422);
    expect(problem.title).toBe('Undefined Priority Range');
    expect(problem.type).toBe('urn:problem-type:undefined-priority-range');
    expect(problem.detail).toContain('Impact score 10');
  });

  it('should map RequirementNotFoundException to RFC 7807 problem details with status 404', () => {
    const error = new RequirementNotFoundException('req-uuid-123');
    const problem = ProblemDetailsMapper.toProblemDetails(
      error,
      '/api/requirements/req-uuid-123',
    );

    expect(problem.status).toBe(404);
    expect(problem.title).toBe('Requirement Not Found');
    expect(problem.type).toBe('urn:problem-type:resource-not-found');
    expect(problem.detail).toBe("Requirement with id 'req-uuid-123' was not found.");
    expect(problem.instance).toBe('/api/requirements/req-uuid-123');
  });

  it('should map InvalidStateTransitionException to RFC 7807 problem details with status 422', () => {
    const error = new InvalidStateTransitionException();
    const problem = ProblemDetailsMapper.toProblemDetails(error, testUrl);

    expect(problem.status).toBe(422);
    expect(problem.title).toBe('Invalid State Transition');
    expect(problem.type).toBe('urn:problem-type:invalid-state-transition');
  });

  it('should map HttpException (e.g. UnauthorizedException) to RFC 7807 problem details with status 401', () => {
    const error = new UnauthorizedException('Authorization header is missing.');
    const problem = ProblemDetailsMapper.toProblemDetails(error, testUrl);

    expect(problem.status).toBe(401);
    expect(problem.title).toBe('Unauthorized');
    expect(problem.detail).toBe('Authorization header is missing.');
    expect(problem.instance).toBe(testUrl);
  });

  it('should map generic Error to 500 Internal Server Error problem details', () => {
    const error = new Error('Unexpected database failure');
    const problem = ProblemDetailsMapper.toProblemDetails(error, testUrl);

    expect(problem.status).toBe(500);
    expect(problem.title).toBe('Internal Server Error');
    expect(problem.type).toBe('urn:problem-type:internal-server-error');
    expect(problem.detail).toBe('Unexpected database failure');
  });
});
