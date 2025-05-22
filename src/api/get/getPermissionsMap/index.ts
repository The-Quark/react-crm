import axios from 'axios';
import { IPermissionsMapResponse } from './types';
import { PERMISSSIONS_MAP } from '@/api/url';

export const getPermissionsMap = async (params?: {
  role?: string;
  user_id?: number;
}): Promise<IPermissionsMapResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.role) {
    queryParams.append('role', params.role.toString());
  }

  if (params?.user_id) {
    queryParams.append('user_id', params.user_id.toString());
  }

  const url = `${PERMISSSIONS_MAP}?${queryParams.toString()}`;

  return axios.get<IPermissionsMapResponse>(url).then((res) => res.data);
};
