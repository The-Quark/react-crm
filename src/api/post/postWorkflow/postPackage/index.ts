import axios from 'axios';
import { IPackageFormValues } from '@/api/post/postWorkflow/postPackage/types.ts';
import { PACKAGE_URL } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';

export const postPackage = async (
  data: Omit<IPackageFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackageFormValues> => {
  const cleanedData = cleanValues(data);
  return await axios
    .post<IPackageFormValues>(PACKAGE_URL, cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
