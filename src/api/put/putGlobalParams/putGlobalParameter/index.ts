import axios from 'axios';
import { IGlobalParameterFormValues } from '@/api/post/postGlobalParams/postGlobalParameter/types.ts';
import { COMPANY_GLOBAL_SETTINGS_URL } from '@/api/url';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const putGlobalParameter = async (
  id: number,
  data: Omit<IGlobalParameterFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IPostPutResponse> => {
  const response = await axios.put<IPostPutResponse>(
    `${COMPANY_GLOBAL_SETTINGS_URL}?id=${id}`,
    data,
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return response.data;
};
