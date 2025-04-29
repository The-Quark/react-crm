export interface IReceiverOrderFormValues {
  full_name: string;
  city_id: number;
  phone: string;
  street: string;
  house: string;
  apartment: string;
  location_description?: string;
  notes?: string;
  contact_id?: number | null;
}
