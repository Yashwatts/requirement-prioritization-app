import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProblemDetailsMapper } from '../problem-details/problem-details-mapper';

@Catch()
export class ProblemDetailsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsExceptionFilter.name);

  constructor(private readonly mapper: ProblemDetailsMapper) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const problem = this.mapper.map(exception, request?.url);

    if (problem.status >= 500) {
      this.logger.error(
        `[${request?.method} ${request?.url}] 500 Internal Error:`,
        (exception as Error)?.stack,
      );
    } else {
      this.logger.warn(
        `[${request?.method} ${request?.url}] ${problem.status} - ${problem.title}: ${problem.detail}`,
      );
    }

    response
      .status(problem.status)
      .contentType('application/problem+json')
      .json(problem.toJSON());
  }
}
