import { IPagination } from '@/api/generalManualTypes';

type ClientType = 'legal' | 'individual';

interface Source {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Client {
  id: number;
  type: ClientType;
  sender_type: ClientType;
  receiver_type: ClientType;
  phone: string;
  email: string | null;
  registered_at: string;
  notes: string | null;
  source_id: number;
  country_id: number | null;
  city_id?: number | null;
  country_name: string | null;
  city_name: string | null;
  last_name: string;
  first_name: string;
  patronymic: string | null;
  fullname: string | null;
  birth_date: string;
  gender: 'male' | 'female';
  company_name: string;
  business_type: string;
  bin: string;
  legal_address: string;
  representative_last_name: string;
  representative_first_name: string;
  representative_patronymic: string | null;
  representative_phone: string | null;
  representative_email: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  source: Source;
  application_count: number;
  applications_packages_count: number;
  search_application: string | null;
  phone_history: null | string[];
}

export interface IClientResponse extends IPagination {
  result: Client[];
}
