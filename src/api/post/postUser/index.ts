import axios from 'axios';
import { IUserFormValues, IUserFormValuesResult } from '@/api/post/postUser/types.ts';
import { USERS_REGISTER_URL } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';

export const postCreateUser = async (userData: IUserFormValues): Promise<IUserFormValuesResult> => {
  const formData = new FormData();
  const cleanData = cleanValues(userData);

  Object.entries(cleanData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !(value instanceof Blob)) {
        formData.append(key, String(value));
      } else {
        formData.append(key, value instanceof Blob ? value : String(value));
      }
    }
  });

  const response = await axios.post<IUserFormValuesResult>(USERS_REGISTER_URL, formData, {
    headers: {
      Accept: 'application/json'
    }
  });

  return response.data;
};
