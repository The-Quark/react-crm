import axios from 'axios';
import { IReceiverOrderFormValues } from '@/api/post/postOrderReceiver/types.ts';
import { ORDER_RECEIVER_URL } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const putOrderReceiver = async (
  id: number,
  data: Omit<IReceiverOrderFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IReceiverOrderFormValues> => {
  const cleanData = cleanValues(data);
  return await axios
    .put<IReceiverOrderFormValues>(`${ORDER_RECEIVER_URL}?id=${id}`, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
