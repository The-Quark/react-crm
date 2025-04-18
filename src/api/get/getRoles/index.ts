import axios from 'axios';
import { RolePermissionsResponse } from './types.ts';
import { ROLES_URL } from '@/api/url';

export const getRoles = async (
  id?: number,
  allowed?: boolean
): Promise<RolePermissionsResponse> => {
  const params = new URLSearchParams();

  if (id !== undefined) {
    params.append('id', id.toString());
  }

  if (allowed !== undefined) {
    params.append('allowed', allowed.toString());
  }

  const url = `${ROLES_URL}?${params.toString()}`;

  return await axios.get<RolePermissionsResponse>(url).then((res) => res.data);
};
