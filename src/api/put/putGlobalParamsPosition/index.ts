import axios from 'axios';
import {
  IGlobalParamsPositionFormValues,
  IGlobalParamsPositionResponse
} from '@/api/post/postGlobalParamsPosition/types.ts';
import { GLOBAL_PARAMS_POSITIONS } from '@/api/url';

export const putGlobalParamsPosition = async (
  id: number,
  data: IGlobalParamsPositionFormValues
): Promise<IGlobalParamsPositionResponse> => {
  return await axios
    .put<IGlobalParamsPositionResponse>(`${GLOBAL_PARAMS_POSITIONS}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
