import axios from 'axios';
import {
  IPostCalculateFormFields,
  IPostCalculateFormResponse
} from '@/api/post/postWorkflow/postOrderCalculate/types.ts';
import { ORDER_CALCULATE } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const postOrderCalculate = async (
  data: IPostCalculateFormFields
): Promise<IPostCalculateFormResponse> => {
  const cleanedData = cleanValues(data);
  return await axios
    .post<IPostCalculateFormResponse>(ORDER_CALCULATE, cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
