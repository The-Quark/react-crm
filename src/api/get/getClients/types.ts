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
  phone: string;
  email: string;
  registered_at: string;
  notes: string;
  source_id: number;
  last_name: string;
  first_name: string;
  patronymic: string;
  birth_date: string;
  gender: 'male' | 'female';
  company_name: string;
  business_type: string;
  bin: string;
  legal_address: string;
  representative_last_name: string;
  representative_first_name: string;
  representative_patronymic: string;
  representative_phone: string;
  representative_email: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  source: Source;
  application_count: number;
  applications_packages_count: number;
}

export interface IClientResponse {
  result: Client[];
  count: number;
}
