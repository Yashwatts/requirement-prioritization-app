import { RequirementDomain } from './entity.domain';
import {
  BenefitedInstitution,
  ClientPriority,
  ComplexityEffort,
  DomainArea,
  ManagementPriority,
  RequestingInstitution,
  RequirementState,
  RequirementType,
  StudyModality,
  UserImpactLevel,
} from './types';

describe('RequirementDomain', () => {
  const validProps = {
    code: 101,
    name: 'Integración Pasarela de Pagos',
    description: 'Permitir pagos online con tarjetas locales e internacionales',
    requestingInstitution: RequestingInstitution.FUNIBER,
    requestedBy: 'Dirección Financiera',
    benefitedInstitutions: [
      BenefitedInstitution.FUNIBER,
      BenefitedInstitution.UNEATLANTICO,
      BenefitedInstitution.UNIC,
    ],
    isObligatory: true,
    hasAlternativeSolution: false,
    studyModalities: [StudyModality.VIRTUAL],
    impactUsers: UserImpactLevel.HIGH,
    complexityEffort: ComplexityEffort.M,
    collaboratorDomains: [DomainArea.VENTAS],
    followerDomains: [],
    startDate: new Date('2026-03-01'),
    finishDate: new Date('2026-06-30'),
    type: RequirementType.CLIENT,
    domain: DomainArea.FINANCIERO,
    impactUsersNumericContribution: 10, // Explicit numeric input for test
  };

  describe('calculateImpact() according to SRS US1-AC3', () => {
    it('calculates: Total Benefited + Obligatory (Yes=8) + Alternative (No=8) + Impact Users contribution', () => {
      // 3 institutions + Obligatory Yes (8) + Alternative No (8) + contribution (5) = 24
      const impact = RequirementDomain.calculateImpact(3, true, false, 5);
      expect(impact).toBe(24);
    });

    it('calculates: Total Benefited + Obligatory (No=0) + Alternative (Yes=0) + Impact Users contribution', () => {
      // 2 institutions + Obligatory No (0) + Alternative Yes (0) + contribution (3) = 5
      const impact = RequirementDomain.calculateImpact(2, false, true, 3);
      expect(impact).toBe(5);
    });
  });

  describe('create() with Impact Users specification dependency', () => {
    it('should throw explicit error when Impact Users numeric contribution is missing and impact is not provided', () => {
      const propsWithoutContribution = { ...validProps };
      delete (
        propsWithoutContribution as { impactUsersNumericContribution?: number }
      ).impactUsersNumericContribution;

      expect(() => RequirementDomain.create(propsWithoutContribution)).toThrow(
        'Cannot calculate Impact: numeric contribution for Impact Users by Domain is not defined in the SRS specification.',
      );
    });

    it('should create a valid requirement when Impact Users numeric contribution is provided', () => {
      // 3 institutions + Obligatory Yes (8) + Alternative No (8) + contribution (10) = 29
      const req = RequirementDomain.create(validProps);

      expect(req.id).toBeDefined();
      expect(req.code).toBe(101);
      expect(req.name).toBe('Integración Pasarela de Pagos');
      expect(req.totalBenefitedInstitutions).toBe(3);
      expect(req.impact).toBe(29);
      // Impact 29 > 20 -> High
      expect(req.clientPriority).toBe(ClientPriority.HIGH);
      expect(req.managementPriority).toBe(ManagementPriority.UNDER);
      expect(req.state).toBe(RequirementState.REGISTERED);
    });

    it('should allow overriding client priority on creation according to customer needs', () => {
      const req = RequirementDomain.create({
        ...validProps,
        clientPriorityOverride: ClientPriority.LOW,
      });

      expect(req.clientPriority).toBe(ClientPriority.LOW);
    });

    it('should throw error when name is empty', () => {
      expect(() =>
        RequirementDomain.create({
          ...validProps,
          name: '  ',
        }),
      ).toThrow('Requirement name is mandatory and cannot be empty.');
    });

    it('should throw error when description is missing', () => {
      expect(() =>
        RequirementDomain.create({
          ...validProps,
          description: '',
        }),
      ).toThrow('Requirement description is mandatory.');
    });

    it('should throw error when description exceeds 500 characters', () => {
      expect(() =>
        RequirementDomain.create({
          ...validProps,
          description: 'A'.repeat(501),
        }),
      ).toThrow(
        'Requirement description exceeds the maximum length of 500 characters.',
      );
    });

    it('should throw error when no benefited institutions are provided', () => {
      expect(() =>
        RequirementDomain.create({
          ...validProps,
          benefitedInstitutions: [],
        }),
      ).toThrow('At least one benefited institution is required.');
    });
  });

  describe('calculateClientPriority() exact SRS rules', () => {
    it('returns Low when Impact > 0 and Impact < 10', () => {
      expect(RequirementDomain.calculateClientPriority(1)).toBe(
        ClientPriority.LOW,
      );
      expect(RequirementDomain.calculateClientPriority(5)).toBe(
        ClientPriority.LOW,
      );
      expect(RequirementDomain.calculateClientPriority(9.9)).toBe(
        ClientPriority.LOW,
      );
    });

    it('returns Medium when Impact > 10 and Impact < 20', () => {
      expect(RequirementDomain.calculateClientPriority(10.1)).toBe(
        ClientPriority.MEDIUM,
      );
      expect(RequirementDomain.calculateClientPriority(15)).toBe(
        ClientPriority.MEDIUM,
      );
      expect(RequirementDomain.calculateClientPriority(19.9)).toBe(
        ClientPriority.MEDIUM,
      );
    });

    it('returns High when Impact > 20', () => {
      expect(RequirementDomain.calculateClientPriority(20.1)).toBe(
        ClientPriority.HIGH,
      );
      expect(RequirementDomain.calculateClientPriority(30)).toBe(
        ClientPriority.HIGH,
      );
    });

    it('throws error for boundary values undefined in the SRS (0, 10, 20, negative)', () => {
      expect(() => RequirementDomain.calculateClientPriority(0)).toThrow(
        'Client priority is undefined for Impact score 0',
      );
      expect(() => RequirementDomain.calculateClientPriority(10)).toThrow(
        'Client priority is undefined for Impact score 10',
      );
      expect(() => RequirementDomain.calculateClientPriority(20)).toThrow(
        'Client priority is undefined for Impact score 20',
      );
      expect(() => RequirementDomain.calculateClientPriority(-5)).toThrow(
        'Client priority is undefined for Impact score -5',
      );
    });
  });

  describe('adjustClientPriority()', () => {
    it('should update client priority and bump updatedAt timestamp', () => {
      const req = RequirementDomain.create(validProps);
      const originalUpdatedAt = req.updatedAt;

      req.adjustClientPriority(ClientPriority.LOW);

      expect(req.clientPriority).toBe(ClientPriority.LOW);
      expect(req.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe('setManagementPriority()', () => {
    it('should update management priority without altering state', () => {
      const req = RequirementDomain.create(validProps);
      req.setManagementPriority(ManagementPriority.HIGH);

      expect(req.managementPriority).toBe(ManagementPriority.HIGH);
      expect(req.state).toBe(RequirementState.REGISTERED);
    });

    it('should not alter state when management priority is DISCARDED', () => {
      const req = RequirementDomain.create(validProps);
      req.setManagementPriority(ManagementPriority.DISCARDED);

      expect(req.managementPriority).toBe(ManagementPriority.DISCARDED);
      // State remains unchanged (not coupled to Management Priority)
      expect(req.state).toBe(RequirementState.REGISTERED);
    });
  });
});
