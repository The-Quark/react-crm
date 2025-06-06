import axios from 'axios';
import { SOURCE_URL } from '@/api/url';
import { SourceResponse } from '@/api/get/getGuides/getSources/types.ts';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetSources extends IPaginationParams {
  id?: number;
  title?: string;
}

const getSources = async ({ title, id, per_page, page }: IGetSources): Promise<SourceResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios.get<SourceResponse>(SOURCE_URL, { params }).then((res) => res.data);
};

export { getSources };
