import axios from 'axios';
import { IOrderReceiversResponse } from '@/api/get/getOrderReceivers/types.ts';
import { ORDER_RECEIVER_URL } from '@/api/url';

export const getOrderReceivers = async (id?: number): Promise<IOrderReceiversResponse> => {
  return await axios
    .get<IOrderReceiversResponse>(id ? `${ORDER_RECEIVER_URL}?id=${id}` : ORDER_RECEIVER_URL)
    .then((res) => res.data);
};
