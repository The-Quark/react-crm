import axios from 'axios';
import { IUserFormValues } from '@/api/post/postUser/types.ts';
import { USERS_URL } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';

export const putSimpleUser = async (
  id: number,
  data: Omit<IUserFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IUserFormValues> => {
  const cleanData = cleanValues(data);
  return await axios
    .post<IUserFormValues>(`${USERS_URL}?id=${id}`, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
