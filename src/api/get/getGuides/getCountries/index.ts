import axios from 'axios';
import { CitiesResponse } from '@/api/get/getGuides/getCitiesByCountryCode/types.ts';
import { COUNTRIES_URL } from '@/api/url';

const getCountries = async (params: string): Promise<CitiesResponse> => {
  return await axios
    .get<CitiesResponse>(COUNTRIES_URL, {
      params: {
        fields: params
      }
    })
    .then((res) => res.data);
};

export { getCountries };
