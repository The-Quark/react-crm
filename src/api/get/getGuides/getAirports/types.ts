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

export interface Airport {
  id: number;
  code: string;
  name: string;
  country_id: number | null;
  country: Country | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AirportsResponse extends IPagination {
  result: Airport[];
}
