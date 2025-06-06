import { IPagination } from '@/api/generalManualTypes';

export interface Source {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SourceResponse extends IPagination {
  result: Source[];
}
