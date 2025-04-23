import axios from 'axios';
import { PackageResponse } from '@/api/get/getPackages/types.ts';
import { PACKAGE_URL } from '@/api/url';

const getPackages = async (id?: number): Promise<PackageResponse> => {
  return await axios
    .get<PackageResponse>(id ? `${PACKAGE_URL}?id=${id}` : PACKAGE_URL)
    .then((res) => res.data);
};

export { getPackages };
