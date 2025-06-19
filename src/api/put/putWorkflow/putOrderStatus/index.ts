import axios from 'axios';
import { ORDER_STATUS_CHANGE } from '@/api/url';
import { OrderStatus } from '@/api/enums';
import { cleanValues } from '@/utils/lib/helpers.ts';

export interface IOrderStatus {
  id: number;
  status: OrderStatus;
}

export const putOrderStatus = async (data: IOrderStatus): Promise<IOrderStatus> => {
  const cleanedData = cleanValues(data);
  return await axios
    .put(`${ORDER_STATUS_CHANGE}`, cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
