import axios from 'axios';
import { AIRPORTS } from '@/api/url';
import { IAirportFormValues } from '@/api/post/postGuides/postAirport/types.ts';

export const putAirport = async (
  id: number,
  data: Omit<IAirportFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IAirportFormValues> => {
  return await axios
    .put<IAirportFormValues>(`${AIRPORTS}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
