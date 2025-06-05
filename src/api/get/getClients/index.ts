import axios from 'axios';
import { IClientResponse } from '@/api/get/getClients/types.ts';
import { CLIENT_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetClientsParams extends IPaginationParams {
  id?: number;
  type?: 'legal' | 'individual';
}

export const getClients = async ({
  id,
  type,
  page,
  per_page
}: IGetClientsParams = {}): Promise<IClientResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (type) params.append('type', type.toString());

  return axios.get<IClientResponse>(CLIENT_URL, { params }).then((res) => res.data);
};
