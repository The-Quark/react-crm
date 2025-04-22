export interface Source {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SourceResponse {
  result: Source[];
  count: number;
}
