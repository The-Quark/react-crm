interface Country {
  id: number;
  iso2: string;
  name: string;
  status: number;
  phone_code: string;
  iso3: string;
  region: string;
  subregion: string;
}

interface City {
  id: number;
  country_id: number;
  state_id: number;
  name: string;
  country_code: string;
  country: Country;
}

export interface IOrderSender {
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

export interface IOrderSendersResponse {
  result: IOrderSender[];
  count: number;
}
