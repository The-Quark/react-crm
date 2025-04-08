import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as authHelper from '@/auth/_helpers.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;
const GET_USER_URL = `${API_URL}/users/manage`;

const fetchCurrentUser = async () => {
  const { data } = await axios.get(GET_USER_URL);
  return data;
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false,
    enabled: !!authHelper.getAuth(),
    staleTime: 5 * 60 * 1000
  });
};
