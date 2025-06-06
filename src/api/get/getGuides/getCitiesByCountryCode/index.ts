import axios from 'axios';
import { CitiesResponse } from '@/api/get/getGuides/getCitiesByCountryCode/types.ts';
import { COUNTRIES_URL } from '@/api/url';

const getCitiesByCountryCode = async (
  value: string | number,
  type: 'id' | 'iso2' = 'id'
): Promise<CitiesResponse> => {
  return await axios
    .get<CitiesResponse>(COUNTRIES_URL, {
      params: {
        fields: 'cities',
        [`filters[${type}]`]: value
      }
    })
    .then((res) => res.data);
};

export { getCitiesByCountryCode };
