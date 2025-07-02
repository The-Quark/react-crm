import { IPagination } from '@/api/generalManualTypes';

interface Country {
  id: number;
  iso2: string;
  name: string;
  status: number;
  phone_code: string;
  iso3: string;
  region: string;
  subregion: string;
}

interface Package {
  id: number;
  code: string;
  is_active: boolean;
}

export interface Tariff {
  id: number;
  country_id: number;
  package_type_id: number;
  weight_from: string;
  weight_to: string;
  price: string;
  country: Country;
  package_type: Package | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TariffsResponse extends IPagination {
  result: Tariff[];
}
