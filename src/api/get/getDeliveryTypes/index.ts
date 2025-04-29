import axios from 'axios';
import { DeliveryTypesResponse } from '@/api/get/getDeliveryTypes/types.ts';
import { DELIVERY_TYPES_URL } from '@/api/url';

export const getDeliveryTypes = async (id?: number): Promise<DeliveryTypesResponse> => {
  return await axios
    .get<DeliveryTypesResponse>(id ? `${DELIVERY_TYPES_URL}?id=${id}` : DELIVERY_TYPES_URL)
    .then((res) => res.data);
};
