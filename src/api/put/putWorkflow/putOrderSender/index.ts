import axios from 'axios';
import { ISenderOrderFormValues } from '@/api/post/postWorkflow/postOrderSender/types.ts';
import { ORDER_SENDER_URL } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const putOrderSender = async (
  id: number,
  data: Omit<ISenderOrderFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ISenderOrderFormValues> => {
  const cleanData = cleanValues(data);
  return await axios
    .put<ISenderOrderFormValues>(`${ORDER_SENDER_URL}?id=${id}`, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
