import axios from 'axios';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { APPLICATION_URL } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';

export const postApplication = async (
  data: Omit<IApplicationPostFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IApplicationPostFormValues> => {
  const cleanedData = cleanValues(data);
  return await axios
    .post<IApplicationPostFormValues>(APPLICATION_URL, cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
