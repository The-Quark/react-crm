import axios from 'axios';
import { TASK_URL } from '@/api/url';
import { ITasksResponse } from '@/api/get/getTask/types.ts';

const getTask = async (
  id?: number,
  per_page?: number,
  page?: number,
  title?: string
): Promise<ITasksResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios.get<ITasksResponse>(TASK_URL, { params }).then((res) => res.data);
};

export { getTask };
