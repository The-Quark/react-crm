import axios from 'axios';
import { IAirlineFormValues } from '@/api/post/postAirline/types';
import { AIRLINE_URL } from '@/api/url';

export const putAirline = async (
  id: number,
  data: Omit<IAirlineFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IAirlineFormValues> => {
  return await axios
    .put<IAirlineFormValues>(`${AIRLINE_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
