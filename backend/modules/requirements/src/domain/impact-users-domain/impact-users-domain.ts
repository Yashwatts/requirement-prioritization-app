export interface ImpactQuantity {
  from: number;
  to: number;
  label?: string;
}

export class ImpactUsersDomain {
  id!: number;
  domain_uuid: string;
  impact_number_users_level: number; // 1: Low, 2: Medium, 3: High, 4: Very High
  quantity: ImpactQuantity;

  constructor(
    domain_uuid: string,
    impact_number_users_level: number,
    quantity: ImpactQuantity,
    id?: number,
  ) {
    this.domain_uuid = domain_uuid;
    this.impact_number_users_level = impact_number_users_level;
    this.quantity = quantity;
    if (id !== undefined) {
      this.id = id;
    }
  }

  static create(
    domain_uuid: string,
    impact_number_users_level: number,
    quantity: ImpactQuantity,
  ): ImpactUsersDomain {
    return new ImpactUsersDomain(
      domain_uuid,
      impact_number_users_level,
      quantity,
    );
  }
}
