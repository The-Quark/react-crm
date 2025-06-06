import axios from 'axios';
import { IAirlineRatesResponse } from '@/api/get/getGuides/getAirlineRates/types.ts';
import { AIRLINE_RATE_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetAirlineRates extends IPaginationParams {
  id?: number;
  title?: string;
}

const getAirlineRates = async ({
  id,
  title,
  page,
  per_page
}: IGetAirlineRates): Promise<IAirlineRatesResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios
    .get<IAirlineRatesResponse>(AIRLINE_RATE_URL, { params })
    .then((res) => res.data);
};

export { getAirlineRates };
