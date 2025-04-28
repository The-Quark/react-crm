import axios from 'axios';
import { IApplicationFormValues } from '@/api/post/postApplication/types.ts';
import { APPLICATION_URL } from '@/api/url';

export const postApplication = async (
  data: Omit<IApplicationFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IApplicationFormValues> => {
  return await axios
    .post<IApplicationFormValues>(APPLICATION_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
