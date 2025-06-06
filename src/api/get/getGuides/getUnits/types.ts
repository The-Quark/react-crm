import { IPagination } from '@/api/generalManualTypes';

export interface Unit {
  id: number;
  code: string;
  name: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UnitsResponse extends IPagination {
  result: Unit[];
}
