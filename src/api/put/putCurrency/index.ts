import axios from 'axios';
import { ICurrencyFormValues } from '@/api/post/postCurrency/types.ts';
import { CURRENCY_URL } from '@/api/url';

export const putCurrency = async (
  id: number,
  currencyData: Omit<ICurrencyFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ICurrencyFormValues> => {
  return await axios
    .put<ICurrencyFormValues>(`${CURRENCY_URL}?id=${id}`, currencyData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};
