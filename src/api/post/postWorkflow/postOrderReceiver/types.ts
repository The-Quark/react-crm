export interface IReceiverOrderFormValues {
  first_name: string;
  last_name: string;
  patronymic?: string;
  country_id: number | string;
  city_id: number | string;
  phone: string;
  street: string;
  house: string;
  apartment: string;
  location_description?: string;
  notes?: string;
  contact_id?: number | null | string;
}
