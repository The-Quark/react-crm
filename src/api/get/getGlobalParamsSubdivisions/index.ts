import axios from 'axios';
import { ISubdivisionResponse } from '@/api/get/getGlobalParamsSubdivisions/types.ts';
import { GLOBAL_PARAMS_SUBDIVISIONS } from '@/api/url';

export const getGlobalParamsSubdivisions = async (params?: {
  id?: number;
  company_id?: number;
}): Promise<ISubdivisionResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.id) queryParams.append('id', params.id.toString());
  if (params?.company_id) queryParams.append('company_id', params.company_id.toString());

  const url = queryParams.toString()
    ? `${GLOBAL_PARAMS_SUBDIVISIONS}?${queryParams}`
    : GLOBAL_PARAMS_SUBDIVISIONS;

  return await axios.get<ISubdivisionResponse>(url).then((res) => res.data);
};
