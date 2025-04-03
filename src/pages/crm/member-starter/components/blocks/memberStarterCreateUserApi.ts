import axios from 'axios';
import { IImageInputFile } from '@/components/image-input';

interface UserModel {
  name: string;
  email: string;
  avatar?: IImageInputFile | null;
  password: string;
  phone?: string;
  location?: string;
  position?: string;
}

const api = import.meta.env.VITE_APP_API_URL;
export const CREATE_USER_URL = `${api}/auth/register`;

export const postCreateUser = async (
  userData: Omit<UserModel, 'id' | 'created_at' | 'updated_at'>
): Promise<UserModel> => {
  const formData = new FormData();

  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value instanceof Blob ? value : String(value));
    }
  });

  return await axios
    .post<UserModel>(CREATE_USER_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((res) => res.data);
};
