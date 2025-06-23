import axios from 'axios';
import { IUserFormValues } from '@/api/post/postUser/types.ts';
import { USERS_URL } from '@/api/url';

export const putSimpleUser = async (
  id: number,
  data: Omit<IUserFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IUserFormValues> => {
  return await axios
    .post<IUserFormValues>(`${USERS_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
