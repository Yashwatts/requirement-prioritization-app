import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProblemDetails } from './problem-details';
import {
  RequirementNotFound,
  InvalidRequirement,
  InvalidClientPriority,
} from '@modules/requirements/src/domain/requirement/exceptions/exceptions';

@Injectable()
export class ProblemDetailsMapper {
  map(exception: unknown, requestUrl: string = ''): ProblemDetails {
    if (exception instanceof RequirementNotFound) {
      return new ProblemDetails({
        type: '/problem/RequirementNotFound',
        title: 'Requirement Not Found',
        detail: exception.message,
        instance: requestUrl,
        status: HttpStatus.NOT_FOUND,
        type_constant: 'REQUIREMENT_NOT_FOUND',
      });
    }

    if (exception instanceof InvalidRequirement) {
      return new ProblemDetails({
        type: '/problem/InvalidRequirement',
        title: 'Invalid Requirement',
        detail: exception.message,
        instance: requestUrl,
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        type_constant: 'INVALID_REQUIREMENT',
      });
    }

    if (exception instanceof InvalidClientPriority) {
      return new ProblemDetails({
        type: '/problem/InvalidClientPriority',
        title: 'Invalid Client Priority',
        detail: exception.message,
        instance: requestUrl,
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        type_constant: 'INVALID_CLIENT_PRIORITY',
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const exceptionName = exception.constructor.name || 'HttpException';

      let detail = exception.message;
      let invalidParams: Array<{ name: string; reason: string }> | undefined;
      let title = exception.name;

      if (typeof response === 'object' && response !== null) {
        const resObj = response as Record<string, unknown>;
        title = (resObj.error as string) || exception.name;

        if (Array.isArray(resObj.message)) {
          detail = resObj.message.join('; ');
          invalidParams = resObj.message.map((msg: string) => {
            const firstWord = msg.split(' ')[0] ?? 'field';
            return { name: firstWord, reason: msg };
          });
        } else if (typeof resObj.message === 'string') {
          detail = resObj.message;
        }
      }

      const typeConstant = title
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/__+/g, '_')
        .replace(/^_|_$/g, '');

      return new ProblemDetails({
        type: `/problem/${exceptionName}`,
        title,
        detail,
        instance: requestUrl,
        status,
        type_constant: typeConstant,
        invalidParams,
      });
    }

    const error = exception as Error;
    const errorName = error?.name || 'InternalServerErrorException';
    return new ProblemDetails({
      type: `/problem/${errorName}`,
      title: 'Internal Server Error',
      detail: error?.message || 'An unexpected error occurred.',
      instance: requestUrl,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      type_constant: 'INTERNAL_SERVER_ERROR',
    });
  }
}
