import axios from 'axios';
import { CitiesResponse } from '@/api/get/getCitiesByCountryCode/types.ts';
import { COUNTRIES_URL } from '@/api/url';

const getCitiesByCountryCode = async (countryCode: string): Promise<CitiesResponse> => {
  return await axios
    .get<CitiesResponse>(COUNTRIES_URL, {
      params: {
        fields: 'cities',
        filters: {
          iso2: countryCode
        }
      }
    })
    .then((res) => res.data);
};

export { getCitiesByCountryCode };
