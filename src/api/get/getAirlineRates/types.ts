interface Airline {
  id: number;
  code: string;
  name: string;
  country: number;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface City {
  id: number;
  country_id: number;
  state_id: number;
  name: string;
  country_code: string;
}

interface PackageTypePivot {
  crm_airline_rates_id: number;
  crm_package_type_id: number;
}

interface PackageType {
  id: number;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  pivot: PackageTypePivot;
}

interface DeliveryTypePivot {
  crm_airline_rates_id: number;
  crm_delivery_type_id: number;
}

interface DeliveryType {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  pivot: DeliveryTypePivot;
}

export interface AirlineRate {
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
  airline: Airline;
  package_types: PackageType[];
  delivery_types: DeliveryType[];
}

export interface IAirlineRatesResponse {
  result: AirlineRate[];
  count: number;
}
