import { UserImpactRange } from './interfaces/user-impact-range.interface';

export class ImpactUsers {
  id!: number;
  domain_uuid: string;
  impact_number_users_level: number; // 1: Low, 2: Medium, 3: High, 4: Very High
  quantity: UserImpactRange;

  constructor(
    domain_uuid: string,
    impact_number_users_level: number,
    quantity: UserImpactRange,
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
    quantity: UserImpactRange,
  ): ImpactUsers {
    return new ImpactUsers(domain_uuid, impact_number_users_level, quantity);
  }

  getAverageQuantity(): number {
    const minimumRangeValue = this.quantity?.from ?? 0;
    const maximumRangeValue = this.quantity?.to ?? 0;
    return Math.round((minimumRangeValue + maximumRangeValue) / 2);
  }
}
