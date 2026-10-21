import { SetManagementPriorityHandler } from './set-management-priority.handler';
import { SetManagementPriorityCommand } from './set-management-priority.command';
import { IRequirementRepository } from '../../domain/requirement/requirement.repository.interface';
import { RequirementDomain } from '../../domain/requirement/entity.domain';
import { RequirementNotFoundException } from '../../domain/requirement/exceptions';
import {
  BenefitedInstitution,
  ComplexityEffort,
  DomainArea,
  ManagementPriority,
  RequestingInstitution,
  RequirementState,
  RequirementType,
  StudyModality,
  UserImpactLevel,
} from '../../domain/requirement/types';

describe('SetManagementPriorityHandler', () => {
  let handler: SetManagementPriorityHandler;
  let mockRepository: jest.Mocked<IRequirementRepository>;

  const sampleReq = RequirementDomain.create({
    code: 5,
    name: 'Portal de Alumnos Nuevos',
    description: 'Acceso inicial para registro de asignaturas',
    requestingInstitution: RequestingInstitution.UNEATLANTICO,
    requestedBy: 'Admisiones',
    benefitedInstitutions: [BenefitedInstitution.UNEATLANTICO],
    studyModalities: [StudyModality.PRESENCIAL],
    isObligatory: false,
    hasAlternativeSolution: false,
    impactUsers: UserImpactLevel.MEDIUM,
    complexityEffort: ComplexityEffort.M,
    domain: DomainArea.ADMINISTRACION_ACADEMICA,
    type: RequirementType.EXTERNAL,
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
    handler = new SetManagementPriorityHandler(mockRepository);
  });

  it('should update management priority when requirement exists', async () => {
    mockRepository.findById.mockResolvedValue(sampleReq);

    const command = new SetManagementPriorityCommand(
      sampleReq.id,
      ManagementPriority.HIGH,
    );
    await handler.execute(command);

    expect(mockRepository.findById).toHaveBeenCalledWith(sampleReq.id);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(sampleReq.managementPriority).toBe(ManagementPriority.HIGH);
  });

  it('should update management priority to Discarded without altering state', async () => {
    mockRepository.findById.mockResolvedValue(sampleReq);

    const command = new SetManagementPriorityCommand(
      sampleReq.id,
      ManagementPriority.DISCARDED,
    );
    await handler.execute(command);

    expect(sampleReq.managementPriority).toBe(ManagementPriority.DISCARDED);
    // State remains independent of Management Priority per SRS
    expect(sampleReq.state).toBe(RequirementState.REGISTERED);
  });

  it('should throw NotFoundException when requirement does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const command = new SetManagementPriorityCommand(
      'missing-id',
      ManagementPriority.HIGH,
    );
    await expect(handler.execute(command)).rejects.toThrow(
      RequirementNotFoundException,
    );
  });
});
