import axios from 'axios';
import { ROLE_DISTRIBUTE_URL } from '@/api/url';

export interface UpdateUserRole {
  user: number;
  role: string;
  mode: 'give' | 'revoke';
}

export const putUserRole = async (
  data: Omit<UpdateUserRole, 'id' | 'created_at' | 'updated_at'>
): Promise<UpdateUserRole> => {
  return await axios
    .put<UpdateUserRole>(ROLE_DISTRIBUTE_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
