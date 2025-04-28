import axios from 'axios';
import { APPLICATION_URL } from '@/api/url';
import { ApplicationsStatus } from '@/api/get/getApplications/types.ts';
import { IApplicationPostFormValues } from '@/api/post/postApplication/types.ts';
import { cleanValues } from '@/lib/helpers.ts';

export interface IApplicationPutFormValues extends IApplicationPostFormValues {
  id: number;
  status: ApplicationsStatus;
}

export const putApplication = async (
  id: number,
  data: Omit<IApplicationPutFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IApplicationPutFormValues> => {
  const cleanedData = cleanValues(data);
  return await axios
    .put<IApplicationPutFormValues>(`${APPLICATION_URL}?id=${id}`, cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
