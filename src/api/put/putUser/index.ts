import axios from 'axios';
import { UserModel } from '@/api/put/putUser/types.ts';
import { USERS_URL } from '@/api/url';

export const updateUser = async (
  data: Omit<UserModel, 'id' | 'created_at' | 'updated_at'>,
  removeAvatar: boolean = false
): Promise<UserModel> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value instanceof Blob ? value : String(value));
    }
  });
  const urlWithParam = removeAvatar ? `${USERS_URL}?remove_avatar=true` : USERS_URL;

  return await axios
    .post<UserModel>(urlWithParam, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((res) => res.data);
};
