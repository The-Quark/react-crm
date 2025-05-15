import axios from 'axios';
import {
  IGlobalParamsPositionFormValues,
  IGlobalParamsPositionResponse
} from '@/api/post/postGlobalParamsPosition/types.ts';
import { GLOBAL_PARAMS_POSITIONS } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const postGlobalParamsPosition = async (
  data: IGlobalParamsPositionFormValues
): Promise<IGlobalParamsPositionResponse> => {
  const cleanData = cleanValues(data);
  return await axios
    .post<IGlobalParamsPositionResponse>(GLOBAL_PARAMS_POSITIONS, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
