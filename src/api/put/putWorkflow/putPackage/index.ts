import axios from 'axios';
import { PACKAGE_URL } from '@/api/url';
import { PackageStatus } from '@/api/enums';
import { IPackageFormValues } from '@/api/post/postWorkflow/postPackage/types.ts';
import { cleanValues } from '@/utils/lib/helpers.ts';

export interface IPackagePutFormValues extends IPackageFormValues {
  id: number;
  status: PackageStatus;
  cargo_id: number | string;
}

export const putPackage = async (
  id: number,
  data: Omit<IPackagePutFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPackagePutFormValues> => {
  const cleanedData = cleanValues(data);
  return await axios
    .put<IPackagePutFormValues>(`${PACKAGE_URL}?id=${id}`, cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
