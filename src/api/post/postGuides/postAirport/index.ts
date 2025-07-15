import axios from 'axios';
import { AIRPORTS } from '@/api/url';
import { IAirportFormValues } from '@/api/post/postGuides/postAirport/types.ts';

export const postAirport = async (data: IAirportFormValues): Promise<IAirportFormValues> => {
  return await axios
    .post<IAirportFormValues>(AIRPORTS, data, {
      headers: { 'Content-Type': 'applicWation/json' }
    })
    .then((res) => res.data);
};
