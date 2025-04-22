import axios from 'axios';

export interface UpdateUserRole {
  user: number;
  role: string;
  mode: 'give' | 'revoke';
}

const api = import.meta.env.VITE_APP_API_URL;
export const UPDATE_MEMBER_ROLE_URL = `${api}/roles/distribute`;

export const putUserRole = async (
  userData: Omit<UpdateUserRole, 'id' | 'created_at' | 'updated_at'>
): Promise<UpdateUserRole> => {
  return await axios
    .put<UpdateUserRole>(UPDATE_MEMBER_ROLE_URL, userData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
