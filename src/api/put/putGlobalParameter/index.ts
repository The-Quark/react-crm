import axios from 'axios';
import { IGlobalParameterFormValues } from '@/api/post/postGlobalParameter/types.ts';
import { COMPANY_GLOBAL_SETTINGS_URL } from '@/api/url';

export const putGlobalParameter = async (
  id: number,
  data: Omit<IGlobalParameterFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IGlobalParameterFormValues> => {
  return await axios
    .put<IGlobalParameterFormValues>(`${COMPANY_GLOBAL_SETTINGS_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
