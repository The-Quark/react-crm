import axios from 'axios';
import { IAirlineRateFormValues } from '@/api/post/postGuides/postAirlineRate/types.ts';
import { AIRLINE_RATE_URL } from '@/api/url';

export const putAirlineRate = async (
  id: number,
  data: Omit<IAirlineRateFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IAirlineRateFormValues> => {
  return await axios
    .put<IAirlineRateFormValues>(`${AIRLINE_RATE_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
