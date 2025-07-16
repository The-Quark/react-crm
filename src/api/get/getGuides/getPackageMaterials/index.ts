import axios from 'axios';
import { PackageMaterialResponse } from '@/api/get/getGuides/getPackageMaterials/types.ts';
import { PACKAGE_MATERIAL_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetPackageMaterials extends IPaginationParams {
  id?: number;
  name?: string;
}

const getPackageMaterials = async ({
  id,
  name,
  per_page,
  page
}: IGetPackageMaterials): Promise<PackageMaterialResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', (page + 1).toString());
  if (name) params.append('name', name);

  return await axios
    .get<PackageMaterialResponse>(PACKAGE_MATERIAL_URL, { params })
    .then((res) => res.data);
};

export { getPackageMaterials };
