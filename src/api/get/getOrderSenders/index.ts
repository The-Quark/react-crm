import axios from 'axios';
import { IOrderSendersResponse } from '@/api/get/getOrderSenders/types';
import { ORDER_SENDER_URL } from '@/api/url';

const getOrderSenders = async (id?: number): Promise<IOrderSendersResponse> => {
  return await axios
    .get<IOrderSendersResponse>(id ? `${ORDER_SENDER_URL}?id=${id}` : ORDER_SENDER_URL)
    .then((res) => res.data);
};

export { getOrderSenders };
