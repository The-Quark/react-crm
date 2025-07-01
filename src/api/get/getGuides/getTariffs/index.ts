import axios from 'axios';
import { TARIFFS } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';
import { TariffsResponse } from '@/api/get/getGuides/getTariffs/types.ts';

interface IGetTariffs extends IPaginationParams {
  id?: number;
  country?: string;
}

const getTariffs = async ({
  id,
  country,
  per_page,
  page
}: IGetTariffs): Promise<TariffsResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (country) params.append('country', country);

  return await axios.get<TariffsResponse>(TARIFFS, { params }).then((res) => res.data);
};

export { getTariffs };
