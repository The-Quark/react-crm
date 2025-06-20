export interface ISenderOrderFormValues {
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  bin?: string;
  company_name?: string;
  country_id: number | string;
  city_id: number | string;
  phone: string;
  street: string;
  type?: 'individual' | 'legal';
  house: string;
  apartment?: string;
  location_description?: string;
  notes?: string;
  contact_id?: number | null | string;
}
