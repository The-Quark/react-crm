import axios from 'axios';
import {
  IGlobalParamsDepartmentResponse,
  IGlobalParamsDepartmentFormValues
} from '@/api/post/postGlobalParamsDepartment/types';
import { GLOBAL_PARAMS_DEPARTMENTS } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const postGlobalParamsDepartment = async (
  data: IGlobalParamsDepartmentFormValues
): Promise<IGlobalParamsDepartmentResponse> => {
  const cleanData = cleanValues(data);
  return await axios
    .post<IGlobalParamsDepartmentResponse>(GLOBAL_PARAMS_DEPARTMENTS, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
