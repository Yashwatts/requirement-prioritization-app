import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProblemDocument } from 'http-problem-details';
import {
  resolveFromError,
  resolveFromHttpException,
  toProblemDocument,
} from './problem-details-mapper';
import { ProblemInfo } from './interfaces/problem-info.interface';

@Catch()
export class ProblemDetailsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const info = this.resolve(exception);
    const problem: ProblemDocument = toProblemDocument(info, request.url);

    if (info.status >= 500) {
      this.logger.error(
        `[${request.method} ${request.url}] ${info.status} Internal Error:`,
        (exception as Error)?.stack,
      );
    } else {
      this.logger.warn(
        `[${request.method} ${request.url}] ${info.status} - ${info.title}: ${info.detail}`,
      );
    }

    response
      .status(info.status)
      .contentType('application/problem+json')
      .json(problem);
  }

  private resolve(exception: unknown): ProblemInfo {
    if (exception instanceof Error) {
      const info = resolveFromError(exception);
      if (info) return info;
    }

    if (exception instanceof HttpException) {
      return resolveFromHttpException(exception);
    }

    const error = exception as Error | undefined;
    return {
      type: '/problem/InternalServerError',
      title: 'Internal Server Error',
      detail: error?.message ?? 'An unexpected error occurred.',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      type_constant: 'INTERNAL_SERVER_ERROR',
    };
  }
}
