import axios from 'axios';
import { PackagesResponse } from '@/api/get/getPackages/types.ts';
import { PACKAGE_URL } from '@/api/url';

const getPackages = async (id?: number): Promise<PackagesResponse> => {
  return await axios
    .get<PackagesResponse>(id ? `${PACKAGE_URL}?id=${id}` : PACKAGE_URL)
    .then((res) => res.data);
};

export { getPackages };
