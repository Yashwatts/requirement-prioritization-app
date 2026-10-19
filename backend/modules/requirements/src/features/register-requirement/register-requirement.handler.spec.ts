import { RegisterRequirementHandler } from './register-requirement.handler';
import { RegisterRequirementCommand } from './register-requirement.command';
import { IRequirementRepository } from '../../domain/requirement.repository.interface';
import {
  BenefitedInstitution,
  ComplexityEffort,
  DomainArea,
  RequestingInstitution,
  RequirementType,
  StudyModality,
  UserImpactLevel,
} from '../../domain/types';

describe('RegisterRequirementHandler', () => {
  let handler: RegisterRequirementHandler;
  let mockRepository: jest.Mocked<IRequirementRepository>;

  beforeEach(() => {
    mockRepository = {
      getNextSequenceCode: jest.fn().mockResolvedValue(42),
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findByCode: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
    };
    handler = new RegisterRequirementHandler(mockRepository);
  });

  it('should register a requirement and save it without returning entity ID or data', async () => {
    const command = new RegisterRequirementCommand(
      'Módulo de Facturación Electrónica',
      'Emisión automática de comprobantes fiscales electrónicos',
      RequestingInstitution.FUNIBER,
      'Juan Pérez',
      RequirementType.INTERNAL,
      DomainArea.FINANCIERO,
      [BenefitedInstitution.FUNIBER],
      [StudyModality.VIRTUAL],
      true,
      false,
      UserImpactLevel.VERY_HIGH,
      ComplexityEffort.L,
      [DomainArea.VENTAS],
      [],
      null,
      null,
      undefined,
      undefined,
      10, // impactUsersNumericContribution
      undefined, // impactOverride
    );

    const result = await handler.execute(command);

    // Command must not return entity ID or entity data
    expect(result).toBeUndefined();
    expect(mockRepository.getNextSequenceCode).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const savedArg = mockRepository.save.mock.calls[0][0];
    expect(savedArg.code).toBe(42);
    expect(savedArg.name).toBe('Módulo de Facturación Electrónica');
  });
});
