import axios from 'axios';
import { IAirlineRateFormValues } from '@/api/post/postAirlineRate/types.ts';
import { AIRLINE_RATE_URL } from '@/api/url';

export const postAirlineRate = async (
  data: Omit<IAirlineRateFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IAirlineRateFormValues> => {
  return await axios
    .post<IAirlineRateFormValues>(AIRLINE_RATE_URL, data, {
      headers: { 'Content-Type': 'applicWation/json' }
    })
    .then((res) => res.data);
};
