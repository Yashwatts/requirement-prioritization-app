import { AdjustClientPriorityHandler } from './adjust-client-priority.handler';
import { AdjustClientPriorityCommand } from './adjust-client-priority.command';
import { IRequirementRepository } from '../../domain/requirement.repository.interface';
import { RequirementDomain } from '../../domain/entity.domain';
import { RequirementNotFoundException } from '../../domain/exceptions';
import {
  BenefitedInstitution,
  ClientPriority,
  ComplexityEffort,
  DomainArea,
  RequestingInstitution,
  RequirementType,
  StudyModality,
  UserImpactLevel,
} from '../../domain/types';

describe('AdjustClientPriorityHandler', () => {
  let handler: AdjustClientPriorityHandler;
  let mockRepository: jest.Mocked<IRequirementRepository>;

  const sampleReq = RequirementDomain.create({
    code: 1,
    name: 'Reporte de Matrículas',
    description: 'Generación de reportes de alumnos matriculados',
    requestingInstitution: RequestingInstitution.UNIC,
    requestedBy: 'Secretaría Académica',
    benefitedInstitutions: [BenefitedInstitution.UNIC],
    studyModalities: [StudyModality.PRESENCIAL],
    isObligatory: false,
    hasAlternativeSolution: false,
    impactUsers: UserImpactLevel.LOW,
    complexityEffort: ComplexityEffort.S,
    domain: DomainArea.REPORTERIA,
    type: RequirementType.INTERNAL,
    impactUsersNumericContribution: 5,
  });

  beforeEach(() => {
    mockRepository = {
      getNextSequenceCode: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findByCode: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
    };
    handler = new AdjustClientPriorityHandler(mockRepository);
  });

  it('should adjust client priority when requirement exists', async () => {
    mockRepository.findById.mockResolvedValue(sampleReq);

    const command = new AdjustClientPriorityCommand(
      sampleReq.id,
      ClientPriority.HIGH,
    );
    await handler.execute(command);

    expect(mockRepository.findById).toHaveBeenCalledWith(sampleReq.id);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(sampleReq.clientPriority).toBe(ClientPriority.HIGH);
  });

  it('should throw NotFoundException when requirement does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const command = new AdjustClientPriorityCommand(
      'non-existent-id',
      ClientPriority.HIGH,
    );
    await expect(handler.execute(command)).rejects.toThrow(
      RequirementNotFoundException,
    );
  });
});
