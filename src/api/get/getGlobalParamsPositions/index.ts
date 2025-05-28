import axios from 'axios';
import { IGlobalParamsPositionModel } from '@/api/get/getGlobalParamsPositions/types.ts';
import { GLOBAL_PARAMS_POSITIONS } from '@/api/url';

export const getGlobalParamsPositions = async (params?: {
  id?: number;
  company_id?: number;
}): Promise<IGlobalParamsPositionModel> => {
  const queryParams = new URLSearchParams();

  if (params?.id) queryParams.append('id', params.id.toString());
  if (params?.company_id) queryParams.append('company_id', params.company_id.toString());

  const url = queryParams.toString()
    ? `${GLOBAL_PARAMS_POSITIONS}?${queryParams}`
    : GLOBAL_PARAMS_POSITIONS;

  return await axios.get<IGlobalParamsPositionModel>(url).then((res) => res.data);
};
