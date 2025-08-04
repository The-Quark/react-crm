import { IPagination } from '@/api/generalManualTypes';

export type ChangeRecord = {
  old: string | number | boolean | null;
  new: string | number | boolean | null;
};

export type Changes = {
  [key: string]: ChangeRecord;
};

export interface Log {
  id: number;
  entity_type: string;
  entity_id: number;
  user_id: number | null;
  changes: Changes;
  action: string;
  created_at: string;
  updated_at: string;
}

export interface IAuditLogResponse extends IPagination {
  result: Log[];
}
