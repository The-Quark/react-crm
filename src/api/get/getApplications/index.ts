import axios from 'axios';
import { ApplicationsResponse } from '@/api/get/getApplications/types.ts';
import { APPLICATION_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetApplications extends IPaginationParams {
  id?: number;
  title?: string;
}

const getApplications = async ({
  id,
  title,
  per_page,
  page
}: IGetApplications): Promise<ApplicationsResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios.get<ApplicationsResponse>(APPLICATION_URL, { params }).then((res) => res.data);
};

export { getApplications };
