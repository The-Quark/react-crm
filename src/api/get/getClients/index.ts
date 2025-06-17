import axios from 'axios';
import { IClientResponse } from '@/api/get/getClients/types.ts';
import { CLIENT_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetClientsParams extends IPaginationParams {
  id?: number;
  type?: 'legal' | 'individual';
  city_id?: number;
  full_name?: string;
  phone?: string;
}

export const getClients = async ({
  id,
  type,
  full_name,
  city_id,
  phone,
  page,
  per_page
}: IGetClientsParams = {}): Promise<IClientResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (city_id) params.append('city_id', city_id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (type) params.append('type', type.toString());
  if (full_name) params.append('fullname', full_name.toString());
  if (phone) params.append('phone', phone.toString());

  return axios.get<IClientResponse>(CLIENT_URL, { params }).then((res) => res.data);
};
