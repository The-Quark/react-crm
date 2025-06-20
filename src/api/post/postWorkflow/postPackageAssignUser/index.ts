import axios from 'axios';
import { PACKAGE_ASSIGN_USER } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';

interface IPostPackageAssignUser {
  id: number;
}

export const postPackageAssignUser = async (data: IPostPackageAssignUser) => {
  const cleanedData = cleanValues(data);
  return await axios
    .post(PACKAGE_ASSIGN_USER, cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
