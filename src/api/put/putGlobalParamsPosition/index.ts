import axios from 'axios';
import { IGlobalParamsPositionFormValues } from '@/api/post/postGlobalParamsPosition/types.ts';
import { GLOBAL_PARAMS_POSITIONS } from '@/api/url';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const putGlobalParamsPosition = async (
  id: number,
  data: IGlobalParamsPositionFormValues
): Promise<IPostPutResponse> => {
  const response = await axios.put<IPostPutResponse>(`${GLOBAL_PARAMS_POSITIONS}?id=${id}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
