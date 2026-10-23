import { ImpactQuantity } from "./impact-quantity.types";

export interface ImpactUsersDomainItem {
  id: number;
  domain_uuid: string;
  impact_number_users_level: number;
  quantity: ImpactQuantity;
}
