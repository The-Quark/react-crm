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

const API_URL = import.meta.env.VITE_APP_API_URL;
export const USERS_LIST_URL = `${API_URL}/users/list`;

const getUserList = async (): Promise<UserModel[]> => {
  return await axios.get<UserModel[]>(USERS_LIST_URL).then((res) => res.data);
};

export { getUserList };
