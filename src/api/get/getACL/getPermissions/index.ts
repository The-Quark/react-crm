import axios from 'axios';
import { RolePermissionsResponse } from './types.ts';
import { PERMISSIONS_URL } from '@/api/url';

export const getPermissions = async (role?: number): Promise<RolePermissionsResponse> => {
  const url = role ? `${PERMISSIONS_URL}?role=${role}` : PERMISSIONS_URL;
  return await axios.get<RolePermissionsResponse>(url).then((res) => res.data);
};
