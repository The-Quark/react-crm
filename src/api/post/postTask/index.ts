import axios from 'axios';
import { ITaskFormValues } from '@/api/post/postTask/types.ts';
import { TASK_URL } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const postTask = async (data: ITaskFormValues): Promise<ITaskFormValues> => {
  const cleanData = cleanValues(data);
  const response = await axios.post<ITaskFormValues>(TASK_URL, cleanData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
