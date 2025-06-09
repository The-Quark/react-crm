import axios from 'axios';
import { ApplicationsResponse } from '@/api/get/getWorkflow/getApplications/types.ts';
import { APPLICATION_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetApplications extends IPaginationParams {
  id?: number;
  full_name?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

const getApplications = async ({
  id,
  full_name,
  per_page,
  page,
  status,
  start_date,
  end_date
}: IGetApplications): Promise<ApplicationsResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (full_name) params.append('full_name', full_name);
  if (status) params.append('status', status);
  if (start_date) params.append('start_date', start_date);
  if (end_date) params.append('end_date', end_date);

  return await axios.get<ApplicationsResponse>(APPLICATION_URL, { params }).then((res) => res.data);
};

export { getApplications };
