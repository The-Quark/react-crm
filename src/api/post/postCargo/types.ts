export interface ICargoPostFormValues {
  code: string;
  airline?: number;
  airline_code?: string;
  airline_name?: string;
  departure_date: string;
  arrival_date: string;
  from_airport: string;
  to_airport: string;
  notes: string;
  company_id?: number;
  company_name?: string;
  status: string;
  is_international: boolean;
  packages: number[];
}
