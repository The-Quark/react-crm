export interface IClientFormValues {
  type: 'individual' | 'legal';
  phone?: string;
  email?: string;
  notes?: string;
  initials_code?: string | null;
  source_id: string;
  country_id?: string;
  client_status?: string;
  client_rating?: number;
  city_id?: string;
  last_name?: string;
  first_name?: string;
  patronymic?: string;
  birth_date?: string | null;
  gender?: 'male' | 'female' | 'other';
  company_name?: string;
  business_type?: string;
  bin?: string;
  legal_address?: string;
  representative_last_name?: string;
  representative_first_name?: string;
  representative_patronymic?: string;
  representative_phone?: string;
  representative_email?: string;
  password?: string;
}
