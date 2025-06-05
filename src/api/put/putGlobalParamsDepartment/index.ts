import axios from 'axios';
import { IGlobalParamsDepartmentFormValues } from '@/api/post/postGlobalParamsDepartment/types.ts';
import { GLOBAL_PARAMS_DEPARTMENTS } from '@/api/url';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const putGlobalParamsDepartment = async (
  id: number,
  data: IGlobalParamsDepartmentFormValues
): Promise<IPostPutResponse> => {
  const response = await axios.put<IPostPutResponse>(
    `${GLOBAL_PARAMS_DEPARTMENTS}?id=${id}`,
    data,
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return response.data;
};
