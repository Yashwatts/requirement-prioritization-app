import { UserImpactRange } from './interfaces/user-impact-range.interface';
import { UserImpactLevel } from '../enums/user-impact-level.enum';

export class ImpactUsers {
  id!: number;
  domain_uuid: string;
  impact_number_users_level: UserImpactLevel;
  quantity: UserImpactRange;

  constructor(
    domain_uuid: string,
    impact_number_users_level: UserImpactLevel,
    quantity: UserImpactRange,
  ) {
    this.domain_uuid = domain_uuid;
    this.impact_number_users_level = impact_number_users_level;
    this.quantity = quantity;
  }

  static create(
    domain_uuid: string,
    impact_number_users_level: UserImpactLevel,
    quantity: UserImpactRange,
  ): ImpactUsers {
    return new ImpactUsers(domain_uuid, impact_number_users_level, quantity);
  }
}
