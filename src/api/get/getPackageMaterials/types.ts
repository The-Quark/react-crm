export interface PackageMaterial {
  id: number;
  code: string;
  name: string;
  unit_id: number;
  price: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PackageMaterialResponse {
  result: PackageMaterial[];
  count: number;
}
