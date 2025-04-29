import axios from 'axios';
import { OrderReceiversResponse } from '@/api/get/getOrderReceivers/types.ts';
import { ORDER_RECEIVER_URL } from '@/api/url';

export const getOrderReceivers = async (id?: number): Promise<OrderReceiversResponse> => {
  return await axios
    .get<OrderReceiversResponse>(id ? `${ORDER_RECEIVER_URL}?id=${id}` : ORDER_RECEIVER_URL)
    .then((res) => res.data);
};
