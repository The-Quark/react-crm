export interface IGlobalParamsSubdivisionFormValues {
  company_id: string | number;
  name: string;
  timezone?: string;
  language_id: string | number;
  currency_id: string | number;
  legal_address: string;
  warehouse_address: string;
  is_active?: boolean;
}

export interface IGlobalParamsSubdivisionResponse {
  result: number;
}
