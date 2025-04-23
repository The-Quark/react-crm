import axios from 'axios';
import { PackageMaterialResponse } from '@/api/get/getPackageMaterials/types.ts';
import { PACKAGE_MATERIALS_URL } from '@/api/url';

const getPackageMaterials = async (id?: number): Promise<PackageMaterialResponse> => {
  return await axios
    .get<PackageMaterialResponse>(id ? `${PACKAGE_MATERIALS_URL}?id=${id}` : PACKAGE_MATERIALS_URL)
    .then((res) => res.data);
};

export { getPackageMaterials };
