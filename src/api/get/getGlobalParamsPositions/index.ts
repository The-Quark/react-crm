import axios from 'axios';
import { GLOBAL_PARAMS_POSITIONS } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';
import { IGlobalParamsPositionModel } from '@/api/get/getGlobalParamsPositions/types.ts';

interface IGetGlobalParamsPositionsParams extends IPaginationParams {
  id?: number;
  company_id?: number;
}

export const getGlobalParamsPositions = async ({
  id,
  per_page,
  page,
  company_id
}: IGetGlobalParamsPositionsParams = {}): Promise<IGlobalParamsPositionModel> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (company_id) params.append('company_id', company_id.toString());

  return axios
    .get<IGlobalParamsPositionModel>(GLOBAL_PARAMS_POSITIONS, { params })
    .then((res) => res.data);
};
