import axios from 'axios';
import { IDeliveryTypeFormValues } from '@/api/post/postGuides/postDeliveryType/types.ts';
import { DELIVERY_TYPES_URL } from '@/api/url';

export const putDeliveryType = async (
  id: number,
  data: Omit<IDeliveryTypeFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IDeliveryTypeFormValues> => {
  return await axios
    .put<IDeliveryTypeFormValues>(`${DELIVERY_TYPES_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
