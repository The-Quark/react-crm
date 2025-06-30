import axios from 'axios';
import { BOX_TYPES } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';
import { BoxTypeResponse } from '@/api/get/getGuides/getBoxTypes/types.ts';

interface IGetBoxType extends IPaginationParams {
  id?: number;
  name?: string;
}

const getBoxTypes = async ({ name, id, page, per_page }: IGetBoxType): Promise<BoxTypeResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (name) params.append('name', name);

  return await axios.get<BoxTypeResponse>(BOX_TYPES, { params }).then((res) => res.data);
};

export { getBoxTypes };
