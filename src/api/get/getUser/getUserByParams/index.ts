import axios from 'axios';
import { IGetUserByParams } from '@/api/get/getUser/getUserByParams/types.ts';
import { USERS_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetUserParams extends IPaginationParams {
  id?: number;
  companyId?: number;
  role?: string;
}

export const getUserByParams = async ({
  id,
  companyId,
  role,
  page,
  per_page
}: IGetUserParams): Promise<IGetUserByParams> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', (page + 1).toString());
  if (companyId) params.append('company_id', companyId.toString());
  if (role) params.append('role', role.toString());

  return await axios.get<IGetUserByParams>(USERS_URL, { params }).then((res) => res.data);
};
