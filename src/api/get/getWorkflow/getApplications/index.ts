import axios from 'axios';
import { ApplicationsResponse } from '@/api/get/getWorkflow/getApplications/types.ts';
import { APPLICATION_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetApplications extends IPaginationParams {
  id?: number;
  full_name?: string;
  status?: string;
}

const getApplications = async ({
  id,
  full_name,
  per_page,
  page,
  status
}: IGetApplications): Promise<ApplicationsResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (full_name) params.append('full_name', full_name);
  if (status) params.append('status', status);

  return await axios.get<ApplicationsResponse>(APPLICATION_URL, { params }).then((res) => res.data);
};

export { getApplications };
