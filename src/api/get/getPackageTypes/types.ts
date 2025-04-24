export interface PackageTypeLanguage {
  id: number;
  package_types_id: number;
  name: string;
  crm_languages_id: number;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PackageType {
  id: number;
  code: string;
  language_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  language: PackageTypeLanguage[];
}

export interface PackageTypesResponse {
  result: PackageType[];
  count: number;
}
