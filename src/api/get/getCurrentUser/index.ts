import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as authHelper from '@/auth/_helpers.ts';
import { UserResponse } from '@/api/get/getCurrentUser/types.ts';
import { USERS_URL } from '@/api/url';

const fetchCurrentUser = async () => {
  const { data } = await axios.get<UserResponse>(USERS_URL);
  console.log(data.result[0]);
  return data.result[0];
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false,
    enabled: !!authHelper.getAuth(),
    staleTime: Infinity
  });
};
