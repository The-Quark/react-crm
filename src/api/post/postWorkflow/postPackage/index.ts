import axios from 'axios';
import { IPackageFormValues } from '@/api/post/postWorkflow/postPackage/types.ts';
import { PACKAGE_URL } from '@/api/url';

export const postPackage = async (
  data: Omit<IPackageFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackageFormValues> => {
  return await axios
    .post<IPackageFormValues>(
      PACKAGE_URL,
      { ...data, frontcrm: true },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    .then((res) => res.data);
};
