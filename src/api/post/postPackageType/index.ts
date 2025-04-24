import axios from 'axios';
import { IPackageTypeFormValues } from '@/api/post/postPackageType/types.ts';
import { PACKAGE_TYPES_URL } from '@/api/url';

export const postPackageType = async (
  data: Omit<IPackageTypeFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackageTypeFormValues> => {
  return await axios
    .post<IPackageTypeFormValues>(PACKAGE_TYPES_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
