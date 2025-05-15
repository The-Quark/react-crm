import axios from 'axios';
import { IGlobalParamsDepartments } from '@/api/get/getGlobalParamsDepartments/types';
import { GLOBAL_PARAMS_DEPARTMENTS } from '@/api/url';

export const getGlobalParamsDepartments = async (
  id?: number
): Promise<IGlobalParamsDepartments> => {
  return await axios
    .get<IGlobalParamsDepartments>(
      id ? `${GLOBAL_PARAMS_DEPARTMENTS}?id=${id}` : GLOBAL_PARAMS_DEPARTMENTS
    )
    .then((res) => res.data);
};
