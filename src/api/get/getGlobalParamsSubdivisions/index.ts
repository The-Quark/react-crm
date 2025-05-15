import axios from 'axios';
import { ISubdivisionResponse } from '@/api/get/getGlobalParamsSubdivisions/types.ts';
import { GLOBAL_PARAMS_SUBDIVISIONS } from '@/api/url';

export const getGlobalParamsSubdivisions = async (id?: number): Promise<ISubdivisionResponse> => {
  return await axios
    .get<ISubdivisionResponse>(
      id ? `${GLOBAL_PARAMS_SUBDIVISIONS}?id=${id}` : GLOBAL_PARAMS_SUBDIVISIONS
    )
    .then((res) => res.data);
};
