import axios from 'axios';
import { CargoResponse } from '@/api/get/getWorkflow/getCargo/types.ts';
import { CARGO_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetCargo extends IPaginationParams {
  id?: number;
  code?: string;
  status?: string;
  delivery_category?: string;
  hawb?: string;
}

const getCargo = async ({
  id,
  code,
  per_page,
  page,
  status,
  delivery_category,
  hawb
}: IGetCargo = {}): Promise<CargoResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (code) params.append('code', code.toString());
  if (status) params.append('status', status.toString());
  if (delivery_category) params.append('delivery_category', delivery_category.toString());
  if (hawb) params.append('hawb', hawb.toString());

  return await axios.get<CargoResponse>(CARGO_URL, { params }).then((res) => res.data);
};

export { getCargo };
