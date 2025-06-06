import axios from 'axios';
import { IOrdersResponse } from '@/api/get/getOrder/types.ts';
import { ORDER_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetOrders extends IPaginationParams {
  id?: number;
  title?: string;
}

const getOrders = async ({ id, title, page, per_page }: IGetOrders): Promise<IOrdersResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios.get<IOrdersResponse>(ORDER_URL, { params }).then((res) => res.data);
};

export { getOrders };
