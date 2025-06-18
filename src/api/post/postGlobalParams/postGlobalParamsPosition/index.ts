import axios from 'axios';
import { IGlobalParamsPositionFormValues } from '@/api/post/postGlobalParams/postGlobalParamsPosition/types.ts';
import { GLOBAL_PARAMS_POSITIONS } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const postGlobalParamsPosition = async (
  data: IGlobalParamsPositionFormValues
): Promise<IPostPutResponse> => {
  const cleanData = cleanValues(data);
  const response = await axios.post<IPostPutResponse>(GLOBAL_PARAMS_POSITIONS, cleanData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
