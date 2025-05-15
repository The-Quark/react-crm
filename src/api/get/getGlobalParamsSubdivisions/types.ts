interface Company {
  id: number;
  company_name: string;
  timezone: string;
  currency: string;
  language: string;
  legal_address: string;
  warehouse_address: string;
  dimensions_per_place: string;
  cost_per_airplace: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  airlines: any | null;
}

interface Language {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  name: string;
  native_name: string;
  locale: string;
  direction: string;
  is_active: boolean;
  deleted_at: string | null;
}

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  is_base: boolean;
  rate_to_base: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Subdivision {
  id: number;
  company_id: number;
  language_id: number;
  currency_id: number;
  name: string;
  legal_address: string;
  warehouse_address: string;
  timezone: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  company: Company;
  language: Language;
  currency: Currency;
}

export interface ISubdivisionResponse {
  result: Subdivision[];
  count: number;
}
