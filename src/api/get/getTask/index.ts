import axios from 'axios';
import { TASK_URL } from '@/api/url';
import { ITasksResponse } from '@/api/get/getTask/types.ts';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetTaskParams extends IPaginationParams {
  id?: number;
  title?: string;
}

const getTask = async ({
  id,
  per_page,
  page,
  title
}: IGetTaskParams = {}): Promise<ITasksResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', (page + 1).toString());
  if (title) params.append('title', title.toString());

  return axios.get<ITasksResponse>(TASK_URL, { params }).then((res) => res.data);
};

export { getTask };
