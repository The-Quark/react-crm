import axios from 'axios';
import { PACKAGE_URL } from '@/api/url';
import { PackageStatus } from '@/api/enums';
import { IPackageFormValues } from '@/api/post/postWorkflow/postPackage/types.ts';

export interface IPackagePutFormValues extends IPackageFormValues {
  id: number;
  status: PackageStatus;
}

export const putPackage = async (
  id: number,
  data: IPackagePutFormValues
): Promise<IPackagePutFormValues> => {
  return await axios
    .put<IPackagePutFormValues>(`${PACKAGE_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
