import axios from 'axios';
import { ORDER_URL } from '@/api/url';
import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';

export interface IOrderPutFormValues extends IOrderFormValues {
  id: number;
  status: 'package_awaiting' | 'buy_for_someone' | 'package_received' | 'expired';
}

export const putOrder = async (
  id: number,
  data: IOrderPutFormValues
): Promise<IOrderPutFormValues> => {
  return await axios
    .put<IOrderPutFormValues>(`${ORDER_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
