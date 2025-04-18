import axios from 'axios';
import { RolePermissionsResponse } from './types.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;
const GET_ROLES_PERMISSIONS_URL = `${API_URL}/permissions/manage`;

export const getPermissions = async (role?: number): Promise<RolePermissionsResponse> => {
  const url = role ? `${GET_ROLES_PERMISSIONS_URL}?role=${role}` : GET_ROLES_PERMISSIONS_URL;
  return await axios.get<RolePermissionsResponse>(url).then((res) => res.data);
};
