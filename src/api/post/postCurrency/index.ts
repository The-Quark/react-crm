import axios from 'axios';
import { ICurrencyFormValues } from '@/api/post/postCurrency/types.ts';
import { CURRENCY_URL } from '@/api/url';

export const postCurrency = async (
  languageData: Omit<ICurrencyFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ICurrencyFormValues> => {
  return await axios
    .post<ICurrencyFormValues>(CURRENCY_URL, languageData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
