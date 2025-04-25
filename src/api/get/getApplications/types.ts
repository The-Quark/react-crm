interface Source {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Application {
  id: number;
  source_id: number;
  status: 'new' | 'running' | 'completed' | 'declined';
  full_name: string;
  phone: string;
  email: string | null;
  message: string | null;
  processed_at: string | null;
  client_id: number | null;
  order_id: number | null;
  created_by: number;
  company_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  source: Source;
}

export interface ApplicationsResponse {
  result: Application[];
  count: number;
}
