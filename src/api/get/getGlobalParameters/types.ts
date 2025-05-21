interface Airline {
  id: number;
  name: string;
  code: string;
}

interface Language {
  id: number;
  name: string;
  code: string;
  native_name: string;
  locale: string;
  direction: string;
  is_active: boolean;
}
export interface ParametersModel {
  id: number;
  company_name: string;
  timezone: string;
  currency: string;
  language: Language;
  legal_address: string;
  warehouse_address: string;
  airlines: Airline[];
  dimensions_per_place: string;
  cost_per_airplace: string;
  package_standard_box1: string | null;
  package_standard_box2: string | null;
  cost_package_box1: string | null;
  cost_package_box2: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface ParametersListResponse {
  result: ParametersModel[];
  count: number;
}
