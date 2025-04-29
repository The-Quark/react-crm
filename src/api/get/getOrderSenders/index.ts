import axios from 'axios';
import { OrderSendersResponse } from '@/api/get/getOrderSenders/types';
import { ORDER_SENDER_URL } from '@/api/url';

const getOrderSenders = async (id?: number): Promise<OrderSendersResponse> => {
  return await axios
    .get<OrderSendersResponse>(id ? `${ORDER_SENDER_URL}?id=${id}` : ORDER_SENDER_URL)
    .then((res) => res.data);
};

export { getOrderSenders };
