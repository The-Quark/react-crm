import axios from 'axios';
import { CurrencyResponse } from '@/api/get/getGuides/getCurrencies/types.ts';
import { CURRENCY_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetCurrencies extends IPaginationParams {
  id?: number;
  title?: string;
}

const getCurrencies = async ({
  title,
  id,
  page,
  per_page
}: IGetCurrencies): Promise<CurrencyResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios.get<CurrencyResponse>(CURRENCY_URL, { params }).then((res) => res.data);
};

export { getCurrencies };
