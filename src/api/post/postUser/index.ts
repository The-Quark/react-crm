import axios from 'axios';
import { paths } from '@/api/types';

const api = import.meta.env.VITE_APP_API_URL;
export const CREATE_USER_URL = `${api}/auth/register`;

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

  await axios.post(CREATE_USER_URL, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return;
};
