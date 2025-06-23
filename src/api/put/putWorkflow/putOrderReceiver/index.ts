import axios from 'axios';
import { IReceiverOrderFormValues } from '@/api/post/postWorkflow/postOrderReceiver/types.ts';
import { ORDER_RECEIVER_URL } from '@/api/url';

export const putOrderReceiver = async (
  id: number,
  data: Omit<IReceiverOrderFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IReceiverOrderFormValues> => {
  return await axios
    .put<IReceiverOrderFormValues>(`${ORDER_RECEIVER_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
