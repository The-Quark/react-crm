import axios from 'axios';
import { IPackageFormValues } from '@/api/post/postPackage/types';
import { PACKAGE_URL } from '@/api/url';

export const putPackage = async (
  id: number,
  data: Omit<IPackageFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackageFormValues> => {
  return await axios
    .put<IPackageFormValues>(`${PACKAGE_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
