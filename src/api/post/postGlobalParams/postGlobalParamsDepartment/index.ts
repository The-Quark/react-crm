import axios from 'axios';
import { IGlobalParamsDepartmentFormValues } from '@/api/post/postGlobalParams/postGlobalParamsDepartment/types.ts';
import { GLOBAL_PARAMS_DEPARTMENTS } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const postGlobalParamsDepartment = async (
  data: IGlobalParamsDepartmentFormValues
): Promise<IPostPutResponse> => {
  const cleanData = cleanValues(data);
  const response = await axios.post<IPostPutResponse>(GLOBAL_PARAMS_DEPARTMENTS, cleanData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
