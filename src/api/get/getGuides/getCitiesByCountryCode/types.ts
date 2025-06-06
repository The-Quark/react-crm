import { IPagination } from '@/api/generalManualTypes';

export interface City {
  id: number;
  name: string;
}
interface Country {
  id: number;
  name: string;
  iso2: string;
  cities: City[];
}
export interface CitiesResponse {
  success: boolean;
  message: string;
  data: Country[];
  response_time: string;
}
