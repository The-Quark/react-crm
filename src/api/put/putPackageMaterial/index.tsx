import axios from 'axios';
import { IPackageMaterialFormValues } from '@/api/post/postPackageMaterial/types';
import { PACKAGE_MATERIALS_URL } from '@/api/url';

export const putPackageMaterial = async (
  id: number,
  data: Omit<IPackageMaterialFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackageMaterialFormValues> => {
  return await axios
    .put<IPackageMaterialFormValues>(`${PACKAGE_MATERIALS_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
