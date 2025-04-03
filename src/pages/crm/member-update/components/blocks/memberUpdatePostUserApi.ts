import axios from 'axios';
import { IImageInputFile } from '@/components/image-input';

interface UserModel {
  id: number;
  name: string;
  email: string;
  avatar?: IImageInputFile | null;
  phone?: string;
  location?: string;
  position?: string;
}

const api = import.meta.env.VITE_APP_API_URL;
export const UPDATE_USER_URL = `${api}/users/manage`;

export const postUpdateUser = async (
  userData: Omit<UserModel, 'id' | 'created_at' | 'updated_at'>,
  removeAvatar: boolean = false
): Promise<UserModel> => {
  const formData = new FormData();

  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value instanceof Blob ? value : String(value));
    }
  });
  const urlWithParam = removeAvatar ? `${UPDATE_USER_URL}?remove_avatar=true` : UPDATE_USER_URL;

  return await axios
    .post<UserModel>(urlWithParam, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((res) => res.data);
};
