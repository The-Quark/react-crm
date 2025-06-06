import axios from 'axios';
import { PackagesResponse } from '@/api/get/getPackages/types.ts';
import { PACKAGE_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetPackages extends IPaginationParams {
  id?: number;
  title?: string;
}

const getPackages = async ({
  id,
  title,
  page,
  per_page
}: IGetPackages = {}): Promise<PackagesResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios.get<PackagesResponse>(PACKAGE_URL, { params }).then((res) => res.data);
};

export { getPackages };
