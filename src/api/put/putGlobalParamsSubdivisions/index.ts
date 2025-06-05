import axios from 'axios';
import { IGlobalParamsSubdivisionFormValues } from '@/api/post/postGlobalParamsSubdivision/types.ts';
import { GLOBAL_PARAMS_SUBDIVISIONS } from '@/api/url';
import { IPostPutResponse } from '@/api/generalManualTypes';

export const putGlobalParamsSubdivisions = async (
  id: number,
  data: IGlobalParamsSubdivisionFormValues
): Promise<IPostPutResponse> => {
  return await axios
    .put<IPostPutResponse>(`${GLOBAL_PARAMS_SUBDIVISIONS}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
