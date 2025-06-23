import axios from 'axios';
import { ITaskFormValues } from '@/api/post/postTask/types.ts';
import { TASK_URL } from '@/api/url';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const putTask = async (id: number, data: ITaskFormValues): Promise<IPostPutResponse> => {
  const response = await axios.put<IPostPutResponse>(`${TASK_URL}?id=${id}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
