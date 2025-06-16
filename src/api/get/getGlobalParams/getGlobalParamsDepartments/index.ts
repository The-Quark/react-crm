import axios from 'axios';
import { IGlobalParamsDepartments } from '@/api/get/getGlobalParams/getGlobalParamsDepartments/types.ts';
import { GLOBAL_PARAMS_DEPARTMENTS } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetGlobalParamsDepartmentsParams extends IPaginationParams {
  id?: number;
  company_id?: number;
  name?: string;
  is_active?: boolean;
}

export const getGlobalParamsDepartments = async ({
  id,
  per_page,
  page,
  company_id,
  name,
  is_active
}: IGetGlobalParamsDepartmentsParams = {}): Promise<IGlobalParamsDepartments> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (company_id) params.append('company_id', company_id.toString());
  if (name) params.append('name', name.toString());
  if (typeof is_active === 'boolean') params.append('is_active', is_active ? '1' : '0');

  return axios
    .get<IGlobalParamsDepartments>(GLOBAL_PARAMS_DEPARTMENTS, { params })
    .then((res) => res.data);
};
