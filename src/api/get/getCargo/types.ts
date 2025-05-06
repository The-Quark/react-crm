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

export interface Cargo {
  id: number;
  code: string;
  airline: number;
  status: 'formed' | string;
  departure_date: string;
  arrival_date: string;
  from_airport: string;
  to_airport: string;
  notes: string;
  company_id: number;
  document_count: number | null;
  has_scan: boolean;
  has_signed_act: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_international: boolean;
  medias: any[];
  media: any[];
  company: Company;
  packages: any[];
}

export interface CargoResponse {
  result: Cargo[];
  count: number;
}
