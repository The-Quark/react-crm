export interface ICargoPostFormValues {
  code: string;
  airline: number | string;
  departure_date: string;
  arrival_date: string;
  from_airport: string;
  to_airport: string;
  notes: string;
  company_id: number | string;
  status: string;
  is_international: boolean;
  packages: number[];
}
