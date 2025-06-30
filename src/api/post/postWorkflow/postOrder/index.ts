import axios from 'axios';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { ORDER_URL } from '@/api/url';

export const postOrder = async (
  data: Omit<IOrderFormValues, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'status'>
): Promise<IOrderFormValues> => {
  return await axios
    .post<IOrderFormValues>(ORDER_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
