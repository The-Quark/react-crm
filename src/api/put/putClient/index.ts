import axios from 'axios';
import { IClientFormValues } from '@/api/post/postClient/types.ts';
import { CLIENT_URL } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const putClient = async (id: number, data: IClientFormValues): Promise<IPostPutResponse> => {
  const cleanData = cleanValues(data);
  const response = await axios.put<IPostPutResponse>(`${CLIENT_URL}?id=${id}`, cleanData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
