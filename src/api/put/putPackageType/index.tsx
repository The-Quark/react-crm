import axios from 'axios';
import { IPackageTypeFormValues } from '@/api/post/postPackageType/types';
import { PACKAGE_TYPES_URL } from '@/api/url';

export const putPackageType = async (
  id: number,
  data: Omit<IPackageTypeFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackageTypeFormValues> => {
  return await axios
    .put<IPackageTypeFormValues>(`${PACKAGE_TYPES_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
