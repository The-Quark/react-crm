import axios from 'axios';
import { IPackageFormValues } from '@/api/post/postWorkflow/postPackage/types.ts';
import { PACKAGE_URL } from '@/api/url';

export const postPackage = async (
  data: Omit<IPackageFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackageFormValues> => {
  const { status, ...cleanData } = data;
  return await axios
    .post<IPackageFormValues>(
      PACKAGE_URL,
      { ...cleanData, frontcrm: true },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    .then((res) => res.data);
};
