import axios from 'axios';
import { ITaskFormValues } from '@/api/post/postTask/types.ts';
import { TASK_URL } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const putTask = async (
  id: number,
  data: Omit<ITaskFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ITaskFormValues> => {
  const cleanData = cleanValues(data);
  return await axios
    .put<ITaskFormValues>(`${TASK_URL}?id=${id}`, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
