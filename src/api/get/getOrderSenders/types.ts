interface City {
  id: number;
  country_id: number;
  state_id: number;
  name: string;
  country_code: string;
}

export interface OrderSender {
  id: number;
  contact_id: number | null;
  full_name: string;
  country_id: number;
  city_id: number;
  phone: string;
  street: string;
  house: string;
  apartment: string;
  location_description: string;
  notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  city: City;
}

export interface OrderSendersResponse {
  result: OrderSender[];
  count: number;
}
