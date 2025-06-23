import axios from 'axios';
import { ISenderOrderFormValues } from '@/api/post/postWorkflow/postOrderSender/types.ts';
import { ORDER_SENDER_URL } from '@/api/url';

export const putOrderSender = async (
  id: number,
  data: Omit<ISenderOrderFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ISenderOrderFormValues> => {
  return await axios
    .put<ISenderOrderFormValues>(`${ORDER_SENDER_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
