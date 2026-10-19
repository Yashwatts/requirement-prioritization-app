import { HttpException, HttpStatus } from '@nestjs/common';
import { DomainException } from './domain.exception';
import { ProblemDetails } from './problem-details.interface';

export class ProblemDetailsMapper {
  static toProblemDetails(
    exception: unknown,
    instance?: string,
  ): ProblemDetails {
    if (exception instanceof DomainException) {
      return exception.toProblemDetails(instance);
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      let detail = exception.message;
      let invalidParams: Array<{ name: string; reason: string }> | undefined;

      if (typeof res === 'string') {
        detail = res;
      } else if (typeof res === 'object' && res !== null) {
        const body = res as Record<string, unknown>;
        if (Array.isArray(body.message)) {
          detail = body.message.join('; ');
          invalidParams = body.message.map((msg) => ({
            name: typeof msg === 'string' ? msg.split(' ')[0] : 'parameter',
            reason: String(msg),
          }));
        } else if (typeof body.message === 'string') {
          detail = body.message;
        }
      }

      return {
        type: `urn:problem-type:http-${status}`,
        title: exception.name.replace(/Exception$/, ''),
        status,
        detail,
        instance,
        ...(invalidParams ? { invalidParams } : {}),
      };
    }

    const message =
      exception instanceof Error
        ? exception.message
        : 'An unexpected internal error occurred.';

    return {
      type: 'urn:problem-type:internal-server-error',
      title: 'Internal Server Error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      detail: message,
      instance,
    };
  }
}
