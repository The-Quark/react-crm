import { IPagination } from '@/api/generalManualTypes';

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  rate_to_base: number;
  is_base: boolean;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CurrencyResponse extends IPagination {
  result: Currency[];
}
