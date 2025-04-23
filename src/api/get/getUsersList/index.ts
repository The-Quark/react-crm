import axios from 'axios';
import { UserListResponse } from '@/api/get/getUsersList/types.ts';
import { USERS_LIST_URL } from '@/api/url';

const getUserList = async (): Promise<UserListResponse> => {
  return await axios.get<UserListResponse>(USERS_LIST_URL).then((res) => res.data);
};

export { getUserList };
