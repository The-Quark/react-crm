import axios from 'axios';
import { RolePermissionsResponse } from './types.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;
const GET_ROLES_URL = `${API_URL}/roles/manage`;

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

  const url = `${GET_ROLES_URL}?${params.toString()}`;

  return await axios.get<RolePermissionsResponse>(url).then((res) => res.data);
};
