import axios from 'axios';
import { ITaskFormValues } from '@/api/post/postTask/types.ts';
import { TASK_URL } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const putTask = async (id: number, data: ITaskFormValues): Promise<IPostPutResponse> => {
  const cleanData = cleanValues(data);
  const response = await axios.put<IPostPutResponse>(`${TASK_URL}?id=${id}`, cleanData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
