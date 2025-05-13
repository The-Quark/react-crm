import axios from 'axios';
import { ITaskFormValues } from '@/api/post/postTask/types.ts';
import { TASK_URL } from '@/api/url';

export const postTask = async (data: ITaskFormValues): Promise<ITaskFormValues> => {
  return await axios
    .post<ITaskFormValues>(TASK_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
