import axios from 'axios';

export interface UpdateMemberRole {
  user: number;
  role: string;
  mode: 'give' | 'revoke';
}

const api = import.meta.env.VITE_APP_API_URL;
export const UPDATE_MEMBER_ROLE_URL = `${api}/roles/distribute`;

export const putMemberRole = async (
  userData: Omit<UpdateMemberRole, 'id' | 'created_at' | 'updated_at'>
): Promise<UpdateMemberRole> => {
  return await axios
    .put<UpdateMemberRole>(UPDATE_MEMBER_ROLE_URL, userData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
