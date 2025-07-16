import axios from 'axios';
import { PackagesResponse } from '@/api/get/getWorkflow/getPackages/types.ts';
import { PACKAGE_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetPackages extends IPaginationParams {
  id?: number;
  hawb?: string;
  status?: string;
  delivery_category?: string;
}

const getPackages = async ({
  id,
  hawb,
  page,
  per_page,
  status,
  delivery_category
}: IGetPackages = {}): Promise<PackagesResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', (page + 1).toString());
  if (hawb) params.append('hawb', hawb.toString());
  if (status) params.append('status', status.toString());
  if (delivery_category) params.append('delivery_category', delivery_category.toString());

  return await axios.get<PackagesResponse>(PACKAGE_URL, { params }).then((res) => res.data);
};

export { getPackages };
