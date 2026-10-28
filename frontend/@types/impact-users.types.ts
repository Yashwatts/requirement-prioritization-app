export interface UserImpactRange {
  from: number;
  to: number;
}

export interface UserImpactRanges {
  LOW: UserImpactRange;
  MEDIUM: UserImpactRange;
  HIGH: UserImpactRange;
  VERY_HIGH: UserImpactRange;
}

export interface DomainImpactUsers {
  domain_uuid: string;
  impact_users: UserImpactRanges;
}
