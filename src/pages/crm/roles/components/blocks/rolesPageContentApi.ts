import axios from 'axios';
import { RolePermissionsResponse } from './types.ts';
const API_URL = import.meta.env.VITE_APP_API_URL;
const GET_ROLES_URL = `${API_URL}/roles/manage`;

const getRoles = async (): Promise<RolePermissionsResponse> => {
  return await axios.get<RolePermissionsResponse>(GET_ROLES_URL).then((res) => res.data);
};

export { getRoles };
