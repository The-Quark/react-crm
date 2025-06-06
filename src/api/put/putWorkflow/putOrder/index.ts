import axios from 'axios';
import { ORDER_URL } from '@/api/url';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { cleanValues } from '@/lib/helpers.ts';

export interface IOrderPutFormValues extends IOrderFormValues {
  id: number;
  status: 'package_awaiting' | 'buy_for_someone' | 'package_received' | 'expired';
}

export const putOrder = async (
  id: number,
  data: Omit<IOrderPutFormValues, 'created_at' | 'updated_at'>
): Promise<IOrderPutFormValues> => {
  const cleanedData = cleanValues(data);
  return await axios
    .put<IOrderPutFormValues>(`${ORDER_URL}?id=${id}`, cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
