import axios from 'axios';
import { IGetUserByParams } from '@/api/get/getUserByParams/types.ts';
import { USERS_URL } from '@/api/url';

type GetUserParams = {
  id?: number;
  companyId?: number;
  role?: string;
};

export const getUserByParams = async (params: GetUserParams): Promise<IGetUserByParams> => {
  const queryParams = new URLSearchParams();

  if (params.id !== undefined) {
    queryParams.append('id', params.id.toString());
  }

  if (params.companyId !== undefined) {
    queryParams.append('company_id', params.companyId.toString());
  }

  if (params.role !== undefined) {
    queryParams.append('role', params.role);
  }

  const url = `${USERS_URL}?${queryParams.toString()}`;
  return await axios.get<IGetUserByParams>(url).then((res) => res.data);
};
