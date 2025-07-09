import { IPagination } from '@/api/generalManualTypes';

export interface FileType {
  id: number;
  name: string;
  types: string[];
  step: number;
  entity_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface FileTypesResponse extends IPagination {
  result: FileType[];
}
