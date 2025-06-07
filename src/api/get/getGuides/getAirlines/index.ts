import axios from 'axios';
import { AirlineResponse } from '@/api/get/getGuides/getAirlines/types.ts';
import { AIRLINE_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetAirlines extends IPaginationParams {
  id?: number;
  name?: string;
}

const getAirlines = async ({
  id,
  name,
  per_page,
  page
}: IGetAirlines): Promise<AirlineResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (name) params.append('name', name);

  return await axios.get<AirlineResponse>(AIRLINE_URL, { params }).then((res) => res.data);
};

export { getAirlines };
