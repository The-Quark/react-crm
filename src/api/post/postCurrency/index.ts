import axios from 'axios';
import { ICurrencyFormValues } from '@/api/post/postCurrency/types.ts';
import { CURRENCY_URL } from '@/api/url';

export const postCurrency = async (
  data: Omit<ICurrencyFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ICurrencyFormValues> => {
  return await axios
    .post<ICurrencyFormValues>(CURRENCY_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
