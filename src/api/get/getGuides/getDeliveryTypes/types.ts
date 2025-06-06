import { IPagination } from '@/api/generalManualTypes';

export interface DeliveryType {
  id: number;
  name: string;
  description?: string;
  icon?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DeliveryTypesResponse extends IPagination {
  result: DeliveryType[];
}
