export interface IReceiverOrderFormValues {
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  bin?: string;
  company_name?: string;
  country_id: number | string;
  city_id: number | string;
  type?: 'individual' | 'legal';
  phone: string;
  street: string;
  house: string;
  apartment?: string;
  location_description?: string;
  notes?: string;
  contact_id?: number | null | string;
}
