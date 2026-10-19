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
import {
  ValidationDomainException,
  SpecificationDependencyException,
  UndefinedPriorityException,
  InvalidStateTransitionException,
} from './exceptions';

export interface CreateRequirementDomainProps {
  id?: string;
  code?: number;
  name: string;
  description: string;
  requestingInstitution: RequestingInstitution;
  requestedBy: string;
  benefitedInstitutions: BenefitedInstitution[];
  isObligatory: boolean;
  hasAlternativeSolution: boolean;
  studyModalities: StudyModality[];
  impactUsers: UserImpactLevel;
  complexityEffort: ComplexityEffort;
  clientPriorityOverride?: ClientPriority;
  managementPriority?: ManagementPriority;
  domain: DomainArea;
  collaboratorDomains?: DomainArea[];
  followerDomains?: DomainArea[];
  startDate?: Date | null;
  finishDate?: Date | null;
  type: RequirementType;
  impact?: number;
  impactUsersNumericContribution?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReconstituteRequirementProps {
  id: string;
  code: number;
  name: string;
  description: string;
  requestingInstitution: RequestingInstitution;
  requestedBy: string;
  benefitedInstitutions: BenefitedInstitution[];
  totalBenefitedInstitutions: number;
  isObligatory: boolean;
  hasAlternativeSolution: boolean;
  studyModalities: StudyModality[];
  impactUsers: UserImpactLevel;
  impact: number;
  complexityEffort: ComplexityEffort;
  clientPriority: ClientPriority;
  managementPriority: ManagementPriority;
  domain: DomainArea;
  collaboratorDomains: DomainArea[];
  followerDomains: DomainArea[];
  state: RequirementState;
  startDate: Date | null;
  finishDate: Date | null;
  type: RequirementType;
  createdAt: Date;
  updatedAt: Date;
}

export class RequirementDomain {
  private readonly _id: string;
  private readonly _code: number;
  private _name: string;
  private _description: string;
  private _requestingInstitution: RequestingInstitution;
  private _requestedBy: string;
  private _benefitedInstitutions: BenefitedInstitution[];
  private _totalBenefitedInstitutions: number;
  private _isObligatory: boolean;
  private _hasAlternativeSolution: boolean;
  private _studyModalities: StudyModality[];
  private _impactUsers: UserImpactLevel;
  private _impact: number;
  private _complexityEffort: ComplexityEffort;
  private _clientPriority: ClientPriority;
  private _managementPriority: ManagementPriority;
  private _domain: DomainArea;
  private _collaboratorDomains: DomainArea[];
  private _followerDomains: DomainArea[];
  private _state: RequirementState;
  private _startDate: Date | null;
  private _finishDate: Date | null;
  private _type: RequirementType;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ReconstituteRequirementProps) {
    this._id = props.id;
    this._code = props.code;
    this._name = props.name;
    this._description = props.description;
    this._requestingInstitution = props.requestingInstitution;
    this._requestedBy = props.requestedBy;
    this._benefitedInstitutions = props.benefitedInstitutions;
    this._totalBenefitedInstitutions = props.totalBenefitedInstitutions;
    this._isObligatory = props.isObligatory;
    this._hasAlternativeSolution = props.hasAlternativeSolution;
    this._studyModalities = props.studyModalities;
    this._impactUsers = props.impactUsers;
    this._impact = props.impact;
    this._complexityEffort = props.complexityEffort;
    this._clientPriority = props.clientPriority;
    this._managementPriority = props.managementPriority;
    this._domain = props.domain;
    this._collaboratorDomains = props.collaboratorDomains;
    this._followerDomains = props.followerDomains;
    this._state = props.state;
    this._startDate = props.startDate;
    this._finishDate = props.finishDate;
    this._type = props.type;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // --- Factory Method (Creation with Invariants and Calculations) ---
  public static create(props: CreateRequirementDomainProps): RequirementDomain {
    if (!props.name || props.name.trim().length === 0) {
      throw new ValidationDomainException(
        'Requirement name is mandatory and cannot be empty.',
      );
    }
    if (!props.description || props.description.trim().length === 0) {
      throw new ValidationDomainException(
        'Requirement description is mandatory.',
      );
    }
    if (props.description.length > 500) {
      throw new ValidationDomainException(
        'Requirement description exceeds the maximum length of 500 characters.',
      );
    }
    if (
      !props.benefitedInstitutions ||
      props.benefitedInstitutions.length === 0
    ) {
      throw new ValidationDomainException(
        'At least one benefited institution is required.',
      );
    }

    const totalBenefited = props.benefitedInstitutions.length;
    let impact: number;
    if (props.impact !== undefined) {
      impact = props.impact;
    } else if (props.impactUsersNumericContribution !== undefined) {
      impact = this.calculateImpact(
        totalBenefited,
        props.isObligatory,
        props.hasAlternativeSolution,
        props.impactUsersNumericContribution,
      );
    } else {
      throw new SpecificationDependencyException(
        'Cannot calculate Impact: numeric contribution for Impact Users by Domain is not defined in the SRS specification.',
      );
    }

    const clientPriority =
      props.clientPriorityOverride ?? this.calculateClientPriority(impact);

    const now = new Date();

    return new RequirementDomain({
      id: props.id ?? crypto.randomUUID(),
      code: props.code ?? 0, // Assigned sequentially or by DB sequence
      name: props.name.trim(),
      description: props.description.trim(),
      requestingInstitution: props.requestingInstitution,
      requestedBy: props.requestedBy.trim(),
      benefitedInstitutions: [...props.benefitedInstitutions],
      totalBenefitedInstitutions: totalBenefited,
      isObligatory: props.isObligatory,
      hasAlternativeSolution: props.hasAlternativeSolution,
      studyModalities: [...props.studyModalities],
      impactUsers: props.impactUsers,
      impact,
      complexityEffort: props.complexityEffort,
      clientPriority,
      managementPriority: props.managementPriority ?? ManagementPriority.UNDER,
      domain: props.domain,
      collaboratorDomains: props.collaboratorDomains
        ? [...props.collaboratorDomains]
        : [],
      followerDomains: props.followerDomains ? [...props.followerDomains] : [],
      state: RequirementState.REGISTERED,
      startDate: props.startDate ?? null,
      finishDate: props.finishDate ?? null,
      type: props.type,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  // --- Reconstitution from Database (No validation bypass of historical state) ---
  public static reconstitute(
    props: ReconstituteRequirementProps,
  ): RequirementDomain {
    return new RequirementDomain(props);
  }

  // --- Pure Business Domain Calculations (from SRS US1 - AC3) ---
  public static calculateImpact(
    totalBenefitedInstitutions: number,
    isObligatory: boolean,
    hasAlternativeSolution: boolean,
    impactUsersNumericContribution: number,
  ): number {
    // Formula: Impact = Total benefited institutions + Obligatory + Alternative solution exists + Impact users
    // For Obligatory: Yes = 8, No = 0
    const obligatoryValue = isObligatory ? 8 : 0;

    // If there's an alternative solution: Yes = 0, No = 8
    const alternativeSolutionValue = hasAlternativeSolution ? 0 : 8;

    return (
      totalBenefitedInstitutions +
      obligatoryValue +
      alternativeSolutionValue +
      impactUsersNumericContribution
    );
  }

  public static calculateClientPriority(impact: number): ClientPriority {
    // Low: Impact > 0 and Impact < 10
    // Medium: Impact > 10 and Impact < 20
    // High: Impact > 20
    if (impact > 0 && impact < 10) {
      return ClientPriority.LOW;
    }
    if (impact > 10 && impact < 20) {
      return ClientPriority.MEDIUM;
    }
    if (impact > 20) {
      return ClientPriority.HIGH;
    }
    throw new UndefinedPriorityException(impact);
  }

  // --- Business Behavior Operations ---

  /**
   * Modifies the client priority according to the customer's needs (SRS US1 - AC2)
   */
  public adjustClientPriority(newPriority: ClientPriority): void {
    this._clientPriority = newPriority;
    this._updatedAt = new Date();
  }

  /**
   * Sets the management priority
   */
  public setManagementPriority(newPriority: ManagementPriority): void {
    this._managementPriority = newPriority;
    this._updatedAt = new Date();
  }

  // --- Getters (Encapsulation) ---
  public get id(): string {
    return this._id;
  }
  public get code(): number {
    return this._code;
  }
  public get name(): string {
    return this._name;
  }
  public get description(): string {
    return this._description;
  }
  public get requestingInstitution(): RequestingInstitution {
    return this._requestingInstitution;
  }
  public get requestedBy(): string {
    return this._requestedBy;
  }
  public get benefitedInstitutions(): BenefitedInstitution[] {
    return [...this._benefitedInstitutions];
  }
  public get totalBenefitedInstitutions(): number {
    return this._totalBenefitedInstitutions;
  }
  public get isObligatory(): boolean {
    return this._isObligatory;
  }
  public get hasAlternativeSolution(): boolean {
    return this._hasAlternativeSolution;
  }
  public get studyModalities(): StudyModality[] {
    return [...this._studyModalities];
  }
  public get impactUsers(): UserImpactLevel {
    return this._impactUsers;
  }
  public get impact(): number {
    return this._impact;
  }
  public get complexityEffort(): ComplexityEffort {
    return this._complexityEffort;
  }
  public get clientPriority(): ClientPriority {
    return this._clientPriority;
  }
  public get managementPriority(): ManagementPriority {
    return this._managementPriority;
  }
  public get domain(): DomainArea {
    return this._domain;
  }
  public get collaboratorDomains(): DomainArea[] {
    return [...this._collaboratorDomains];
  }
  public get followerDomains(): DomainArea[] {
    return [...this._followerDomains];
  }
  public get state(): RequirementState {
    return this._state;
  }
  public get startDate(): Date | null {
    return this._startDate;
  }
  public get finishDate(): Date | null {
    return this._finishDate;
  }
  public get type(): RequirementType {
    return this._type;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
