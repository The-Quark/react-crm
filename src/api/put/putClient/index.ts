import axios from 'axios';
import { IClientFormValues } from '@/api/post/postClient/types.ts';
import { CLIENT_URL } from '@/api/url';
import { cleanValues } from '@/lib/helpers.ts';

export const putClient = async (
  id: number,
  data: Omit<IClientFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IClientFormValues> => {
  const cleanData = cleanValues(data);
  return await axios
    .put<IClientFormValues>(`${CLIENT_URL}?id=${id}`, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
