import axios from 'axios';
import { TASK_URL } from '@/api/url';
import { ITasksResponse } from '@/api/get/getTask/types.ts';

const getTask = async (id?: number): Promise<ITasksResponse> => {
  return await axios
    .get<ITasksResponse>(id ? `${TASK_URL}?id=${id}` : TASK_URL)
    .then((res) => res.data);
};

export { getTask };
