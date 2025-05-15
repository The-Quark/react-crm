import axios from 'axios';
import {
  IGlobalParamsSubdivisionResponse,
  IGlobalParamsSubdivisionFormValues
} from '@/api/post/postGlobalParamsSubdivision/types.ts';
import { GLOBAL_PARAMS_SUBDIVISIONS } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const postGlobalParamsSubdivision = async (
  data: IGlobalParamsSubdivisionFormValues
): Promise<IGlobalParamsSubdivisionResponse> => {
  const cleanData = cleanValues(data);
  return await axios
    .post<IGlobalParamsSubdivisionResponse>(GLOBAL_PARAMS_SUBDIVISIONS, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
