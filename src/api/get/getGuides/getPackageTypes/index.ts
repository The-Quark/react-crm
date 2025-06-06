import axios from 'axios';
import { PackageTypesResponse } from '@/api/get/getGuides/getPackageTypes/types.ts';
import { PACKAGE_TYPES_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetPackageTypes extends IPaginationParams {
  id?: number;
  title?: string;
  language_code?: string;
}

const getPackageTypes = async ({
  title,
  language_code,
  id,
  page,
  per_page
}: IGetPackageTypes): Promise<PackageTypesResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);
  if (language_code) params.append('language_code', language_code);

  const res = await axios.get<PackageTypesResponse>(PACKAGE_TYPES_URL, { params });
  return res.data;
};

export { getPackageTypes };
