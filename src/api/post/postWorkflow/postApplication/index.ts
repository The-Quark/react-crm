import axios from 'axios';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { APPLICATION_URL } from '@/api/url';

export const postApplication = async (
  data: Omit<IApplicationPostFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IApplicationPostFormValues> => {
  return await axioss
    .post<IApplicationPostFormValues>(APPLICATION_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
