import axios from 'axios';
import { PackageTypesResponse } from '@/api/get/getGuides/getPackageTypes/types.ts';
import { PACKAGE_TYPES_URL } from '@/api/url';

const getPackageTypes = async (
  id?: number,
  language_code?: string
): Promise<PackageTypesResponse> => {
  const url = id
    ? `${PACKAGE_TYPES_URL}?id=${id}`
    : `${PACKAGE_TYPES_URL}?language_code=${language_code}`;

  const res = await axios.get<PackageTypesResponse>(url);
  return res.data;
};

export { getPackageTypes };
