import axios from 'axios';
import { IOrdersResponse } from '@/api/get/getWorkflow/getOrder/types.ts';
import { ORDER_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetOrders extends IPaginationParams {
  id?: number;
  order_code?: string;
  delivery_category?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

const getOrders = async ({
  id,
  order_code,
  page,
  per_page,
  delivery_category,
  status,
  start_date,
  end_date
}: IGetOrders): Promise<IOrdersResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (order_code) params.append('order_code', order_code.toString());
  if (status) params.append('status', status.toString());
  if (delivery_category) params.append('delivery_category', delivery_category.toString());
  if (start_date) params.append('start_date', start_date);
  if (end_date) params.append('end_date', end_date);

  return await axios.get<IOrdersResponse>(ORDER_URL, { params }).then((res) => res.data);
};

export { getOrders };
