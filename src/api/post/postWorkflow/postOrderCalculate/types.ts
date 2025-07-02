export interface IPostCalculateFormFields {
  width: string | number;
  length: string | number;
  height: string | number;
  weight: string | number;
  is_express?: boolean;
  nominal_cost?: string | number;
}

export interface IPostCalculateFormResponse {
  volume: string;
  places_count: string;
  price: string;
}
