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

export interface Department {
  id: number;
  company_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  company: Company | null;
}

export interface IGlobalParamsDepartments {
  result: Department[];
  count: number;
}
