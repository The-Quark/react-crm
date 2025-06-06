import { IPagination } from '@/api/generalManualTypes';

interface Country {
  id: number;
  iso2: string;
  iso3: string;
  name: string;
  status: number;
  phone_code: string;
  region: string;
  subregion: string;
}

interface City {
  id: number;
  country_id: number;
  state_id: number;
  name: string;
  country_code: string;
}

interface PackageType {
  id: number;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  pivot: {
    crm_airline_rates_id: number;
    crm_package_type_id: number;
  };
}

interface DeliveryType {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  pivot: {
    crm_airline_rates_id: number;
    crm_delivery_type_id: number;
  };
}

interface AirlineRate {
  id: number;
  airline_id: number;
  package_type_id: number | null;
  from_city_id: number;
  to_city_id: number;
  min_weight: string;
  max_weight: string;
  price_per_kg: string;
  currency: string | null;
  delivery_type: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  from_city: City;
  to_city: City;
  package_types: PackageType[];
  delivery_types: DeliveryType[];
}

export interface Airline {
  id: number;
  code: string;
  name: string;
  country: Country;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  rates: AirlineRate[];
}

export interface AirlineResponse extends IPagination {
  result: Airline[];
}
