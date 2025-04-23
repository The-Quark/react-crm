export interface Airline {
  id: number;
  code: string;
  name: string;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AirlineResponse {
  result: Airline[];
  count: number;
}
