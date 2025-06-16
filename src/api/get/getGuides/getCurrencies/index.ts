import axios from 'axios';
import { CurrencyResponse } from '@/api/get/getGuides/getCurrencies/types.ts';
import { CURRENCY_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetCurrencies extends IPaginationParams {
  id?: number;
  name?: string;
  is_active?: boolean;
}

const getCurrencies = async ({
  name,
  id,
  page,
  per_page,
  is_active
}: IGetCurrencies): Promise<CurrencyResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (name) params.append('name', name);
  if (typeof is_active === 'boolean') params.append('is_active', is_active ? '1' : '0');

  return await axios.get<CurrencyResponse>(CURRENCY_URL, { params }).then((res) => res.data);
};

export { getCurrencies };
