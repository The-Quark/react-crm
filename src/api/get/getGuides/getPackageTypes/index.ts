import axios from 'axios';
import { PackageTypesResponse } from '@/api/get/getGuides/getPackageTypes/types.ts';
import { PACKAGE_TYPES_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetPackageTypes extends IPaginationParams {
  id?: number;
  code?: string;
  language_code?: string;
  is_active?: boolean;
}

const getPackageTypes = async ({
  code,
  language_code,
  id,
  page,
  is_active,
  per_page
}: IGetPackageTypes): Promise<PackageTypesResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (code) params.append('code', code.toString());
  if (language_code) params.append('language_code', language_code.toString());
  if (typeof is_active === 'boolean') params.append('is_active', is_active ? '1' : '0');

  const res = await axios.get<PackageTypesResponse>(PACKAGE_TYPES_URL, { params });
  return res.data;
};

export { getPackageTypes };
