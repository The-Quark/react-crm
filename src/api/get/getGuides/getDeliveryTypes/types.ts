export interface DeliveryType {
  id: number;
  name: string;
  description?: string;
  icon?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DeliveryTypesResponse {
  result: DeliveryType[];
  count: number;
}
