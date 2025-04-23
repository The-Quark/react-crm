import axios from 'axios';
import { IAirlineFormValues } from '@/api/post/postAirline/types';
import { AIRLINE_URL } from '@/api/url';

export const postAirline = async (
  data: Omit<IAirlineFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IAirlineFormValues> => {
  return await axios
    .post<IAirlineFormValues>(AIRLINE_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
