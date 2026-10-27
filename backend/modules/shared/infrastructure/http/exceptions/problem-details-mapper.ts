import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ProblemDocument,
  ProblemDocumentExtension,
} from 'http-problem-details';
import {
  ErrorMapper,
  MapperRegistry,
  DefaultMappingStrategy,
} from 'http-problem-details-mapper';
import {
  RequirementNotFound,
  InvalidRequirement,
  InvalidClientPriority,
} from '@modules/requirements/src/domain/requirement/exceptions/exceptions';
import { ProblemInfo } from './interfaces/problem-info.interface';

export function toProblemDocument(
  info: ProblemInfo,
  instance: string,
): ProblemDocument {
  return new ProblemDocument(
    {
      type: info.type,
      title: info.title,
      detail: info.detail,
      status: info.status,
      instance,
    },
    new ProblemDocumentExtension({ type_constant: info.type_constant }),
  );
}

class RequirementNotFoundMapper extends ErrorMapper {
  constructor() {
    super(RequirementNotFound);
  }

  mapError(error: RequirementNotFound): ProblemDocument {
    const info: ProblemInfo = {
      type: '/problem/RequirementNotFound',
      title: 'Requirement Not Found',
      detail: error.message,
      status: HttpStatus.NOT_FOUND,
      type_constant: 'REQUIREMENT_NOT_FOUND',
    };
    return toProblemDocument(info, '');
  }
}

class InvalidRequirementMapper extends ErrorMapper {
  constructor() {
    super(InvalidRequirement);
  }

  mapError(error: InvalidRequirement): ProblemDocument {
    const info: ProblemInfo = {
      type: '/problem/InvalidRequirement',
      title: 'Invalid Requirement',
      detail: error.message,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      type_constant: 'INVALID_REQUIREMENT',
    };
    return toProblemDocument(info, '');
  }
}

class InvalidClientPriorityMapper extends ErrorMapper {
  constructor() {
    super(InvalidClientPriority);
  }

  mapError(error: InvalidClientPriority): ProblemDocument {
    const info: ProblemInfo = {
      type: '/problem/InvalidClientPriority',
      title: 'Invalid Client Priority',
      detail: error.message,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      type_constant: 'INVALID_CLIENT_PRIORITY',
    };
    return toProblemDocument(info, '');
  }
}

const registry = new MapperRegistry({ useDefaultErrorMapper: false })
  .registerMapper(new RequirementNotFoundMapper())
  .registerMapper(new InvalidRequirementMapper())
  .registerMapper(new InvalidClientPriorityMapper());

export const mappingStrategy = new DefaultMappingStrategy(registry);

export function resolveFromError(error: Error): ProblemInfo | null {
  if (error instanceof RequirementNotFound) {
    return {
      type: '/problem/RequirementNotFound',
      title: 'Requirement Not Found',
      detail: error.message,
      status: HttpStatus.NOT_FOUND,
      type_constant: 'REQUIREMENT_NOT_FOUND',
    };
  }

  if (error instanceof InvalidRequirement) {
    return {
      type: '/problem/InvalidRequirement',
      title: 'Invalid Requirement',
      detail: error.message,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      type_constant: 'INVALID_REQUIREMENT',
    };
  }

  if (error instanceof InvalidClientPriority) {
    return {
      type: '/problem/InvalidClientPriority',
      title: 'Invalid Client Priority',
      detail: error.message,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      type_constant: 'INVALID_CLIENT_PRIORITY',
    };
  }

  return null;
}

export function resolveFromHttpException(
  exception: HttpException,
): ProblemInfo {
  const status = exception.getStatus();
  const response = exception.getResponse();
  const exceptionName = exception.constructor.name;

  let detail = exception.message;
  let title = exception.name;

  if (typeof response === 'object' && response !== null) {
    const res = response as Record<string, unknown>;
    title = typeof res.error === 'string' ? res.error : exception.name;

    if (Array.isArray(res.message)) {
      detail = (res.message as string[]).join('; ');
    } else if (typeof res.message === 'string') {
      detail = res.message;
    }
  }

  const typeConstant = title
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/__+/g, '_')
    .replace(/^_|_$/g, '');

  return {
    type: `/problem/${exceptionName}`,
    title,
    detail,
    status,
    type_constant: typeConstant,
  };
}
