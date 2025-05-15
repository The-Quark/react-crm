import axios from 'axios';
import { IGlobalParamsPositionModel } from '@/api/get/getGlobalParamsPositions/types.ts';
import { GLOBAL_PARAMS_POSITIONS } from '@/api/url';

export const getGlobalParamsPositions = async (
  id?: number
): Promise<IGlobalParamsPositionModel> => {
  return await axios
    .get<IGlobalParamsPositionModel>(
      id ? `${GLOBAL_PARAMS_POSITIONS}?id=${id}` : GLOBAL_PARAMS_POSITIONS
    )
    .then((res) => res.data);
};
