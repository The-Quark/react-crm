interface Timezone {
  id: number;
  name: string;
}

interface Currency {
  id: number;
  country_id: number;
  name: string;
  code: string;
  precision: number;
  symbol: string;
  symbol_native: string;
  symbol_first: number;
  decimal_mark: string;
  thousands_separator: string;
}

export interface Country {
  id: number;
  iso2: string;
  name: string;
  phone_code: string;
  currency: Currency;
  timezones: Timezone[];
}

export interface CountriesResponse {
  success: boolean;
  message: string;
  data: Country[];
  response_time: string;
}
