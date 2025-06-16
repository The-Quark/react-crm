import axios from 'axios';
import { SOURCE_URL } from '@/api/url';
import { SourceResponse } from '@/api/get/getGuides/getSources/types.ts';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetSources extends IPaginationParams {
  id?: number;
  name?: string;
  is_active?: boolean;
}

const getSources = async ({
  name,
  id,
  per_page,
  page,
  is_active
}: IGetSources): Promise<SourceResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (name) params.append('name', name);
  if (typeof is_active === 'boolean') params.append('is_active', is_active ? '1' : '0');

  return await axios.get<SourceResponse>(SOURCE_URL, { params }).then((res) => res.data);
};

export { getSources };
