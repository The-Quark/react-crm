import axios from 'axios';
import { UserListResponse } from '@/api/get/getUser/getUsersList/types.ts';
import { USERS_LIST_URL } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetUserList extends IPaginationParams {
  full_name?: string;
}

const getUserList = async ({
  full_name,
  per_page,
  page
}: IGetUserList): Promise<UserListResponse> => {
  const params = new URLSearchParams();

  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (full_name) params.append('full_name', full_name);

  return await axios.get<UserListResponse>(USERS_LIST_URL, { params }).then((res) => res.data);
};

export { getUserList };
