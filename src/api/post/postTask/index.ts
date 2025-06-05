import axios from 'axios';
import { ITaskFormValues } from '@/api/post/postTask/types.ts';
import { TASK_URL } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const postTask = async (data: ITaskFormValues): Promise<IPostPutResponse> => {
  const cleanData = cleanValues(data);
  const response = await axios.post<IPostPutResponse>(TASK_URL, cleanData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
