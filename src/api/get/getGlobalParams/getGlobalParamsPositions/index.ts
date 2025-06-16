import axios from 'axios';
import { GLOBAL_PARAMS_POSITIONS } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';
import { IGlobalParamsPositionModel } from '@/api/get/getGlobalParams/getGlobalParamsPositions/types.ts';

interface IGetGlobalParamsPositionsParams extends IPaginationParams {
  id?: number;
  company_id?: number;
  title?: string;
  is_active?: boolean;
}

export const getGlobalParamsPositions = async ({
  id,
  per_page,
  page,
  company_id,
  title,
  is_active
}: IGetGlobalParamsPositionsParams = {}): Promise<IGlobalParamsPositionModel> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (company_id) params.append('company_id', company_id.toString());
  if (title) params.append('title', title.toString());
  if (typeof is_active === 'boolean') params.append('is_active', is_active ? '1' : '0');

  return axios
    .get<IGlobalParamsPositionModel>(GLOBAL_PARAMS_POSITIONS, { params })
    .then((res) => res.data);
};
