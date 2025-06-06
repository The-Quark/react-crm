import axios from 'axios';
import { DeliveryTypesResponse } from '@/api/get/getGuides/getDeliveryTypes/types.ts';
import { DELIVERY_TYPES_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetDeliveryTypes extends IPaginationParams {
  id?: number;
  title?: string;
}

export const getDeliveryTypes = async ({
  title,
  id,
  per_page,
  page
}: IGetDeliveryTypes): Promise<DeliveryTypesResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios
    .get<DeliveryTypesResponse>(DELIVERY_TYPES_URL, { params })
    .then((res) => res.data);
};
