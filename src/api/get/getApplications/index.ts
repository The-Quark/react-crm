import axios from 'axios';
import { ApplicationsResponse } from '@/api/get/getApplications/types.ts';
import { APPLICATION_URL } from '@/api/url';

const getApplications = async (id?: number): Promise<ApplicationsResponse> => {
  return await axios
    .get<ApplicationsResponse>(id ? `${APPLICATION_URL}?id=${id}` : APPLICATION_URL)
    .then((res) => res.data);
};

export { getApplications };
