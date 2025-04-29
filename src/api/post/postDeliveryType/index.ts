import axios from 'axios';
import { IDeliveryTypeFormValues } from '@/api/post/postDeliveryType/types.ts';
import { DELIVERY_TYPES_URL } from '@/api/url';

export const postDeliveryType = async (
  data: Omit<IDeliveryTypeFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IDeliveryTypeFormValues> => {
  return await axios
    .post<IDeliveryTypeFormValues>(DELIVERY_TYPES_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
