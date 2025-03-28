import axios from 'axios';

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    role_id: number;
    permission_id: number;
  };
}

interface UserModel {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone?: string | null;
  position?: string | null;
  location?: string | null;
  avatar?: string | null;
  last_login?: string | null;
  last_ip?: string | null;
  roles?: Role[];
  permissions?: Permission[];
  can_register: boolean;
}
interface UserListResponse {
  result: UserModel[];
  count: number;
}

const API_URL = import.meta.env.VITE_APP_API_URL;
const USERS_LIST_URL = `${API_URL}/users/list`;

const getUserList = async (): Promise<UserListResponse> => {
  return await axios.get<UserListResponse>(USERS_LIST_URL).then((res) => res.data);
};

export { getUserList };
