import axios from 'axios';
import { IGlobalParamsSubdivisionFormValues } from '@/api/post/postGlobalParamsSubdivision/types.ts';
import { GLOBAL_PARAMS_SUBDIVISIONS } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const postGlobalParamsSubdivision = async (
  data: IGlobalParamsSubdivisionFormValues
): Promise<IPostPutResponse> => {
  const cleanData = cleanValues(data);
  const response = await axios.post<IPostPutResponse>(GLOBAL_PARAMS_SUBDIVISIONS, cleanData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
