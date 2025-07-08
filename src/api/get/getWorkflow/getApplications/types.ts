import { ApplicationsStatus } from '@/api/enums';
import { IPagination } from '@/api/generalManualTypes';
import { Client } from '@/api/get/getClients/types.ts';

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
  full_name: string | undefined;
  source_id: number;
  company_name: string | undefined;
  bin: string | undefined;
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
  client: Client | null;
  length: string | null;
  width: string | null;
  height: string | null;
  weight: string | null;
  box_length: string | null;
  box_width: string | null;
  box_height: string | null;
  is_our_box: string | null;
  box_type_id: string | null;
}

export interface ApplicationsResponse extends IPagination {
  result: Application[];
}
