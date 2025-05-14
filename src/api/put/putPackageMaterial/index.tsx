import axios from 'axios';
import { IPackageMaterialFormValues } from '@/api/post/postPackageMaterial/types';
import { PACKAGE_MATERIAL_URL } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const putPackageMaterial = async (
  id: number,
  data: Omit<IPackageMaterialFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackageMaterialFormValues> => {
  const cleanData = cleanValues(data);
  return await axios
    .put<IPackageMaterialFormValues>(`${PACKAGE_MATERIAL_URL}?id=${id}`, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
