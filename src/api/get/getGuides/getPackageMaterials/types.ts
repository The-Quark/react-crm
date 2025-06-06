import { IPagination } from '@/api/generalManualTypes';

interface Unit {
  id: number;
  code: string;
  name: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

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
  airlines: null | string;
  pivot: {
    package_material_id: number;
    company_id: number;
  };
}

export interface PackageMaterial {
  id: number;
  code: string;
  name: string;
  unit_id: number;
  price: string;
  description: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  unit: Unit;
  company: Company[];
}

export interface PackageMaterialResponse extends IPagination {
  result: PackageMaterial[];
}
