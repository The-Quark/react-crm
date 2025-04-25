import axios from 'axios';
import { CountriesResponse } from '@/api/get/getCountries/types.ts';
import { COUNTRIES_URL } from '@/api/url';

const getCountries = async (): Promise<CountriesResponse> => {
  return await axios
    .get<CountriesResponse>(COUNTRIES_URL, {
      params: {
        fields: 'iso2,phone_code,currency,timezones'
      }
    })
    .then((res) => res.data);
};

export { getCountries };
