export interface ImpactUsersTier {
  from: number;
  to: number;
}

export interface ImpactUsersTiers {
  LOW: ImpactUsersTier;
  MEDIUM: ImpactUsersTier;
  HIGH: ImpactUsersTier;
  VERY_HIGH: ImpactUsersTier;
}

export interface ImpactUsersItem {
  domain_uuid: string;
  impact_users: ImpactUsersTiers;
}
