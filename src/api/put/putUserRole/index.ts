import axios from 'axios';
import { USERS_URL } from '@/api/url';

export interface UpdateUserRole {
  user: number;
  role: string;
  mode: 'give' | 'revoke';
}

export const putUserRole = async (
  data: Omit<UpdateUserRole, 'id' | 'created_at' | 'updated_at'>
): Promise<UpdateUserRole> => {
  return await axios
    .put<UpdateUserRole>(USERS_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
