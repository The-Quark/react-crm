import axios from 'axios';
import { PACKAGE_STATUS } from '@/api/url';
import { PackageStatus } from '@/api/enums';

export interface IPackageStatus {
  id: number;
  status: PackageStatus;
}

export const putPackageStatus = async (data: IPackageStatus) => {
  return await axios
    .put(`${PACKAGE_STATUS}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
