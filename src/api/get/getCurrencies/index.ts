import axios from 'axios';
import { CurrencyResponse } from '@/api/get/getCurrencies/types.ts';
import { CURRENCY_URL } from '@/api/url';

const getCurrencies = async (id?: number): Promise<CurrencyResponse> => {
  return await axios
    .get<CurrencyResponse>(id ? `${CURRENCY_URL}?id=${id}` : CURRENCY_URL)
    .then((res) => res.data);
};

export { getCurrencies };
