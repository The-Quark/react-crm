import axios from 'axios';
import { ISenderOrderFormValues } from '@/api/post/postOrderSender/types.ts';
import { ORDER_SENDER_URL } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const postOrderSender = async (
  data: Omit<ISenderOrderFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<{ result: number }> => {
  const cleanedData = cleanValues(data);
  const response = await axios.post<{ result: number }>(ORDER_SENDER_URL, cleanedData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
