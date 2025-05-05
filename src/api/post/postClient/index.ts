import axios from 'axios';
import { IClientFormValues } from '@/api/post/postClient/types.ts';
import { CLIENT_URL } from '@/api/url';
import { cleanValues } from '@/lib/helpers';

export const postClient = async (
  data: Omit<IClientFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IClientFormValues> => {
  const cleanData = cleanValues(data);
  return await axios
    .post<IClientFormValues>(CLIENT_URL, cleanData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
