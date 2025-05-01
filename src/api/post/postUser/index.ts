import axios from 'axios';
import { paths } from '@/api/types';
import { USERS_REGISTER_URL } from '@/api/url';

type RegisterRequest =
  paths['/auth/register']['post']['requestBody']['content']['application/x-www-form-urlencoded'];
type RegisterResponse = void;

export const postCreateUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  const formData = new FormData();

  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value instanceof Blob ? value : String(value));
    }
  });

  await axios.post(USERS_REGISTER_URL, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return;
};
