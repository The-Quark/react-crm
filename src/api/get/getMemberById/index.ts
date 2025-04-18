import axios from 'axios';
import { UserModel } from './types.ts';
import { USERS_URL } from '@/api/url';

export const getMemberById = async (id: number): Promise<UserModel> => {
  const USER_URL = `${USERS_URL}?id=${id}`;
  try {
    const response = await axios.get(USER_URL);
    return response.data[0].result;
  } catch (err) {
    console.error('Request error:', err);
    throw err;
  }
};
