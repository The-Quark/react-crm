import axios from 'axios';
import {
  IGlobalParamsSubdivisionResponse,
  IGlobalParamsSubdivisionFormValues
} from '@/api/post/postGlobalParamsSubdivision/types.ts';
import { GLOBAL_PARAMS_SUBDIVISIONS } from '@/api/url';

export const putGlobalParamsSubdivisions = async (
  id: number,
  data: IGlobalParamsSubdivisionFormValues
): Promise<IGlobalParamsSubdivisionResponse> => {
  return await axios
    .put<IGlobalParamsSubdivisionResponse>(`${GLOBAL_PARAMS_SUBDIVISIONS}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
