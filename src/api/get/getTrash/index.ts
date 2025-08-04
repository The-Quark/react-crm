import axios from 'axios';
import { TRASH } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';
import { ITrashResponse } from '@/api/get/getTrash/types.ts';

interface IGetTrashParams extends IPaginationParams {
  type: 'order' | 'application' | 'cargo' | 'package';
}

const getTrash = async ({
  per_page,
  page,
  type = 'application'
}: IGetTrashParams): Promise<ITrashResponse> => {
  const params = new URLSearchParams();

  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', (page + 1).toString());

  return axios.get<ITrashResponse>(`${TRASH}/${type}`, { params }).then((res) => res.data);
};

export { getTrash };
