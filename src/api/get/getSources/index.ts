import axios from 'axios';
import { CurrencyResponse } from '@/api/get/getCurrencies/types.ts';
import { SOURCE_URL } from '@/api/url';
import { SourceResponse } from '@/api/get/getSources/types.ts';

const getSources = async (id?: number): Promise<SourceResponse> => {
  return await axios
    .get<CurrencyResponse>(id ? `${SOURCE_URL}?id=${id}` : SOURCE_URL)
    .then((res) => res.data);
};

export { getSources };
