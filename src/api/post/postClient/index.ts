import axios from 'axios';
import { IClientFormValues } from '@/api/post/postClient/types.ts';
import { CLIENT_URL } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const postClient = async (data: IClientFormValues): Promise<IPostPutResponse> => {
  const cleanData = cleanValues(data);
  const response = await axios.post<IPostPutResponse>(CLIENT_URL, cleanData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
