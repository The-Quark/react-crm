import axios from 'axios';
import { APPLICATION_URL } from '@/api/url';
import { ApplicationsStatus } from '@/api/enums';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';

export interface IApplicationPutFormValues extends IApplicationPostFormValues {
  id: number;
  status: ApplicationsStatus;
}

export const putApplication = async (
  id: number,
  data: Omit<IApplicationPutFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IApplicationPutFormValues> => {
  return await axios
    .put<IApplicationPutFormValues>(`${APPLICATION_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
