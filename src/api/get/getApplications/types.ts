import { ApplicationsStatus } from '@/api/enums';

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
  company_name: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  patronymic: string | undefined;
  client_type: 'individual' | 'legal';
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
  status: ApplicationsStatus;
}

export interface ApplicationsResponse {
  result: Application[];
  count: number;
}
