import axios from 'axios';
import { ITaskFormValues } from '@/api/post/postTask/types.ts';
import { TASK_URL } from '@/api/url';

export const putTask = async (
  id: number,
  data: Omit<ITaskFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ITaskFormValues> => {
  return await axios
    .put<ITaskFormValues>(`${TASK_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
