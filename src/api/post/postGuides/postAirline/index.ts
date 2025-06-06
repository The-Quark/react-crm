import axios from 'axios';
import { IAirlineFormValues } from '@/api/post/postGuides/postAirline/types.ts';
import { AIRLINE_URL } from '@/api/url';

export const postAirline = async (
  data: Omit<IAirlineFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IAirlineFormValues> => {
  return await axios
    .post<IAirlineFormValues>(AIRLINE_URL, data, {
      headers: { 'Content-Type': 'applicWation/json' }
    })
    .then((res) => res.data);
};
