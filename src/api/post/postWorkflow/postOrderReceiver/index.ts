import axios from 'axios';
import { IReceiverOrderFormValues } from '@/api/post/postWorkflow/postOrderReceiver/types.ts';
import { ORDER_RECEIVER_URL } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';

export const postOrderReceiver = async (
  data: Omit<IReceiverOrderFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<{ result: number }> => {
  const cleanedData = cleanValues(data);
  const response = await axios.post<{ result: number }>(ORDER_RECEIVER_URL, cleanedData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};
