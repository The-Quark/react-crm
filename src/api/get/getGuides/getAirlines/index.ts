import axios from 'axios';
import { AirlineResponse } from '@/api/get/getGuides/getAirlines/types.ts';
import { AIRLINE_URL } from '@/api/url';

const getAirlines = async (id?: number): Promise<AirlineResponse> => {
  return await axios
    .get<AirlineResponse>(id ? `${AIRLINE_URL}?id=${id}` : AIRLINE_URL)
    .then((res) => res.data);
};

export { getAirlines };
