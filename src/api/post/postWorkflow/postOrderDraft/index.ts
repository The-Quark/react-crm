import axios from 'axios';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { ORDER_DRAFT } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';

export const postOrderDraft = async (data: IOrderFormValues): Promise<IOrderFormValues> => {
  const cleanData = cleanValues(data);
  return await axios
    .post<IOrderFormValues>(ORDER_DRAFT, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
