import axios from 'axios';
import { UnitsResponse } from '@/api/get/getGuides/getUnits/types.ts';
import { UNIT_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetUnits extends IPaginationParams {
  id?: number;
  title?: string;
}

const getUnits = async ({ id, title, per_page, page }: IGetUnits): Promise<UnitsResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios.get<UnitsResponse>(UNIT_URL, { params }).then((res) => res.data);
};

export { getUnits };
