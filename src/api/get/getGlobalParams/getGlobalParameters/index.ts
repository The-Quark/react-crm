import axios from 'axios';
import { ParametersListResponse } from '@/api/get/getGlobalParams/getGlobalParameters/types.ts';
import { COMPANY_GLOBAL_SETTINGS_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetGlobalParametersParams extends IPaginationParams {
  id?: number;
  company_name?: string;
}

const getGlobalParameters = async ({
  id,
  per_page,
  page,
  company_name
}: IGetGlobalParametersParams = {}): Promise<ParametersListResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', (page + 1).toString());
  if (company_name) params.append('company_name', company_name);

  return axios
    .get<ParametersListResponse>(COMPANY_GLOBAL_SETTINGS_URL, { params })
    .then((res) => res.data);
};

export { getGlobalParameters };
