export interface IPostCalculateFormFields {
  width: string | number;
  length: string | number;
  height: string | number;
  weight: string | number;
}

export interface IPostCalculateFormResponse {
  volume: string;
  places_count: string;
  price: string;
}
