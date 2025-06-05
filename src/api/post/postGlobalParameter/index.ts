import axios from 'axios';
import { IGlobalParameterFormValues } from '@/api/post/postGlobalParameter/types.ts';
import { COMPANY_GLOBAL_SETTINGS_URL } from '@/api/url';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const postGlobalParameter = async (
  data: Omit<IGlobalParameterFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPostPutResponse> => {
  const response = await axios.post<IPostPutResponse>(COMPANY_GLOBAL_SETTINGS_URL, data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
