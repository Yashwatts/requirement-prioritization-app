import { ImpactQuantity } from './interfaces/impact-quantity.interface';

export class ImpactUsers {
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
  ): ImpactUsers {
    return new ImpactUsers(domain_uuid, impact_number_users_level, quantity);
  }

  getAverageQuantity(): number {
    const fromVal = this.quantity?.from ?? 0;
    const toVal = this.quantity?.to ?? 0;
    return Math.round((fromVal + toVal) / 2);
  }
}
