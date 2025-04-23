import axios from 'axios';
import { IPackageMaterialFormValues } from '@/api/post/postPackageMaterial/types.ts';
import { PACKAGE_MATERIALS_URL } from '@/api/url';

export const postPackageMaterial = async (
  data: Omit<IPackageMaterialFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackageMaterialFormValues> => {
  return await axios
    .post<IPackageMaterialFormValues>(PACKAGE_MATERIALS_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
