import axios from 'axios';

interface UserModel {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  avatar?: string;
  roles?: string[];
}

const api = import.meta.env.VITE_APP_API_URL;
export const CREATE_USER_URL = `${api}/auth/register`;

export const postCreateUser = async (
  userData: Omit<UserModel, 'id' | 'created_at' | 'updated_at'>
): Promise<UserModel> => {
  return await axios.post<UserModel>(CREATE_USER_URL, userData).then((res) => res.data);
};
