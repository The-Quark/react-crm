import axios from 'axios';
import { RESTORE } from '@/api/url';
import { IPostPutResponse } from '@/api/generalManualTypes';
import { IRestoreFormValues } from '@/api/post/postRestore/types.ts';

export const postRestore = async (data: IRestoreFormValues): Promise<IPostPutResponse> => {
  const response = await axios.post<IPostPutResponse>(`${RESTORE}/${data.type}/${data.id}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
