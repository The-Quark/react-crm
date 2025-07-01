import { IPagination } from '@/api/generalManualTypes';

export interface BoxType {
  id: number;
  name: string;
  length: string;
  width: string;
  height: string;
  max_weight: string;
  description: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BoxTypeResponse extends IPagination {
  result: BoxType[];
}
