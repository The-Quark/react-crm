import axios from 'axios';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { ORDER_URL } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';

export const postOrder = async (
  data: Omit<IOrderFormValues, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'status'>
): Promise<IOrderFormValues> => {
  const cleanData = cleanValues(data);
  return await axios
    .post<IOrderFormValues>(ORDER_URL, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
