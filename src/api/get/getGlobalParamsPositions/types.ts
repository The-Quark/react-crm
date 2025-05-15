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

export interface Position {
  id: number;
  company_id: number;
  title: string;
  description: string;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  company: Company | null;
}

export interface IGlobalParamsPositionModel {
  result: Position[];
  count: number;
}
