import axios from 'axios';
import { AIRPORTS } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';
import { AirportsResponse } from '@/api/get/getGuides/getAirports/types.ts';

interface IGetAirport extends IPaginationParams {
  id?: number;
  name?: string;
  code?: string;
}

const getAirports = async ({
  name,
  code,
  id,
  page,
  per_page
}: IGetAirport): Promise<AirportsResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (name) params.append('name', name.toString());
  if (code) params.append('code', code.toString());

  return await axios.get<AirportsResponse>(AIRPORTS, { params }).then((res) => res.data);
};

export { getAirports };
