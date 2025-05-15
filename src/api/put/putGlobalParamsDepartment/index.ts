import axios from 'axios';
import {
  IGlobalParamsDepartmentResponse,
  IGlobalParamsDepartmentFormValues
} from '@/api/post/postGlobalParamsDepartment/types.ts';
import { GLOBAL_PARAMS_DEPARTMENTS } from '@/api/url';

export const putGlobalParamsDepartment = async (
  id: number,
  data: IGlobalParamsDepartmentFormValues
): Promise<IGlobalParamsDepartmentResponse> => {
  return await axios
    .put<IGlobalParamsDepartmentResponse>(`${GLOBAL_PARAMS_DEPARTMENTS}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
