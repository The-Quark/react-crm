export interface Unit {
  id: number;
  code: string;
  name: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UnitsResponse {
  result: Unit[];
  count: number;
}
