import axios from 'axios';
import { ORDER_STATUS_CHANGE } from '@/api/url';
import { OrderStatus } from '@/api/enums';

export interface IOrderStatus {
  id: number;
  status: OrderStatus;
}

export const putOrderStatus = async (data: IOrderStatus): Promise<IOrderStatus> => {
  return await axios
    .put(`${ORDER_STATUS_CHANGE}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
