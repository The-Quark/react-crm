import axios from 'axios';
import { RolePermissionsResponse } from './types.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;
const GET_ROLES_URL = `${API_URL}/roles/manage`;

export const getRoles = async (id?: number): Promise<RolePermissionsResponse> => {
  const url = id ? `${GET_ROLES_URL}?id=${id}` : GET_ROLES_URL;
  return await axios.get<RolePermissionsResponse>(url).then((res) => res.data);
};
