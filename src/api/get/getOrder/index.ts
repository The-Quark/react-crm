import axios from 'axios';
import { IOrdersResponse } from '@/api/get/getOrder/types.ts';
import { ORDER_URL } from '@/api/url';

const getOrders = async (id?: number): Promise<IOrdersResponse> => {
  return await axios
    .get<IOrdersResponse>(id ? `${ORDER_URL}?id=${id}` : ORDER_URL)
    .then((res) => res.data);
};

export { getOrders };
