import axios from 'axios';
import { IGlobalParameterFormValues } from '@/api/post/postGlobalParameter/types.ts';
import { COMPANY_GLOBAL_SETTINGS_URL } from '@/api/url';

export const postGlobalParameter = async (
  paramsData: Omit<IGlobalParameterFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IGlobalParameterFormValues> => {
  return await axios
    .post<IGlobalParameterFormValues>(COMPANY_GLOBAL_SETTINGS_URL, paramsData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
