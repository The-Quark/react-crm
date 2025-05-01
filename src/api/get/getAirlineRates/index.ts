import axios from 'axios';
import { IAirlineRatesResponse } from '@/api/get/getAirlineRates/types.ts';
import { AIRLINE_RATE_URL } from '@/api/url';

const getAirlineRates = async (id?: number): Promise<IAirlineRatesResponse> => {
  return await axios
    .get<IAirlineRatesResponse>(id ? `${AIRLINE_RATE_URL}?id=${id}` : AIRLINE_RATE_URL)
    .then((res) => res.data);
};

export { getAirlineRates };
