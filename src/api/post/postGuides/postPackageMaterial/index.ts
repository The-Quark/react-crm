import axios from 'axios';
import { IPackageMaterialFormValues } from '@/api/post/postGuides/postPackageMaterial/types.ts';
import { PACKAGE_MATERIAL_URL } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const postPackageMaterial = async (
  data: Omit<IPackageMaterialFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackageMaterialFormValues> => {
  const cleanData = cleanValues(data);
  return await axios
    .post<IPackageMaterialFormValues>(PACKAGE_MATERIAL_URL, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
