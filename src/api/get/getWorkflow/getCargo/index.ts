import axios from 'axios';
import { CargoResponse } from '@/api/get/getWorkflow/getCargo/types.ts';
import { CARGO_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetCargo extends IPaginationParams {
  id?: number;
  title?: string;
}

const getCargo = async ({ id, title, per_page, page }: IGetCargo = {}): Promise<CargoResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios.get<CargoResponse>(CARGO_URL, { params }).then((res) => res.data);
};

export { getCargo };
