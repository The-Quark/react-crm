import axios from 'axios';
import { ISubdivisionResponse } from '@/api/get/getGlobalParamsSubdivisions/types.ts';
import { GLOBAL_PARAMS_SUBDIVISIONS } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetGlobalParamsSubdivisionsParams extends IPaginationParams {
  id?: number;
  company_id?: number;
}

export const getGlobalParamsSubdivisions = async ({
  id,
  per_page,
  page,
  company_id
}: IGetGlobalParamsSubdivisionsParams = {}): Promise<ISubdivisionResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (company_id) params.append('company_id', company_id.toString());

  return axios
    .get<ISubdivisionResponse>(GLOBAL_PARAMS_SUBDIVISIONS, { params })
    .then((res) => res.data);
};
